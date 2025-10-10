package main

import (
	"crypto/rand"
	"encoding/hex"
	"errors"
	"fmt"
	"log"
	"os"
	"time"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
	"golang.org/x/crypto/bcrypt"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

var DB *gorm.DB

type UsersDB struct {
	ID       uint `gorm:"primaryKey"`
	Name     string
	Email    string `gorm:"uniqueIndex"`
	Password string
	Cookie   string
}

func initDB() {
	dsn := "host=localhost user=postgres password=1234 dbname=newsqiq port=5432 sslmode=disable"
	var err error
	DB, err = gorm.Open(postgres.Open(dsn), &gorm.Config{})
	if err != nil {
		log.Fatal("Failed to connect to the DB: ", err)
	}
	DB.AutoMigrate(&UsersDB{})
	log.Println("Connected to the DB")
}
func login_handler_db(email, password string) error {
	var checkUser UsersDB

	err := DB.First(&checkUser, "email = ?", email).Error
	if err != nil {
		return fmt.Errorf("user already exsists")
	}
	var result struct {
		Password string
	}

	err = DB.Model(&UsersDB{}).
		Select("password").
		Where("email = ?", email).
		First(&result).Error
	if err != nil {
		return fmt.Errorf("user not found or DB error: %w", err)
	}

	if bcrypt.CompareHashAndPassword([]byte(result.Password), []byte(password)) != nil {
		return fmt.Errorf("incorrect password")
	}

	return nil
}

type LoginHandlerStruct struct {
	Email    string `json:"email"`
	Password string `json:"password"`
}

func login_handler(c *fiber.Ctx) error {
	if c.Method() != fiber.MethodPost {
		return c.Status(400).JSON(fiber.Map{
			"error": "Invalid request type",
		})
	}
	var data LoginHandlerStruct
	if err := c.BodyParser(&data); err != nil {
		return c.Status(400).JSON(fiber.Map{
			"error": "Invalid request body",
		})
	}
	if err := login_handler_db(data.Email, data.Password); err != nil {
		return c.Status(500).JSON(fiber.Map{
			"error": "Internal server error",
		})
	}
	var hash string
	bytes := make([]byte, 32)
	if _, err := rand.Read(bytes); err != nil {
		hash = ""
	}
	hash = hex.EncodeToString(bytes)
	cookie := new(fiber.Cookie)
	cookie.Name = "session_token"
	cookie.Value = hash
	cookie.Expires = time.Now().Add(24 * time.Hour)
	cookie.HTTPOnly = true
	cookie.Secure = false
	cookie.SameSite = "Lax"
	c.Cookie(cookie)
	return c.Status(200).JSON(fiber.Map{
		"message": "Logged in",
	})
}

type RegisterHandlerStruct struct {
	Name     string `json:"name"`
	Email    string `json:"email"`
	Password string `json:"password"`
}

func register_handler(c *fiber.Ctx) error {
	if c.Method() != fiber.MethodPost {
		return c.Status(400).JSON(fiber.Map{
			"error": "Invalid request type",
		})
	}
	var data RegisterHandlerStruct
	if err := c.BodyParser(&data); err != nil {
		return c.Status(400).JSON(fiber.Map{
			"error": "Invalid request type",
		})
	}
	if err := register_handler_db(data.Name, data.Email, data.Password); err != nil {
		return c.Status(500).JSON(fiber.Map{
			"error": "Internal server error",
		})
	}
	return c.Status(201).JSON(fiber.Map{
		"message": "User created",
	})
}
func register_handler_db(name, email, password string) error {
	var checkUser UsersDB

	// Check if user with that email already exists
	err := DB.First(&checkUser, "email = ?", email).Error
	if err == nil {
		return fmt.Errorf("user already exsists")
	}

	if !errors.Is(err, gorm.ErrRecordNotFound) {
		return fmt.Errorf("database query failed: %w", err)
	}

	hashedPassword, hashErr := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)
	if hashErr != nil {
		return fmt.Errorf("failed to hash password: %w", hashErr)
	}

	user := UsersDB{Name: name, Email: email, Password: string(hashedPassword), Cookie: ""}
	if result := DB.Create(&user); result.Error != nil {
		return fmt.Errorf("failed to insert user: %w", result.Error)
	}

	return nil
}
func fetch_feed_amount_handler(c *fiber.Ctx) error {
	if c.Method() != fiber.MethodGet {
		return c.Status(400).JSON(fiber.Map{
			"error": "Invalid request type",
		})
	}
	return c.Status(200).JSON(fiber.Map{
		"feed_amount": 10,
	})
}
func main() {
	server := fiber.New()
	initDB()
	server.Use(cors.New(cors.Config{
		AllowOrigins: "http://localhost:5173",
		AllowMethods: "GET, POST, DELETE",
		AllowHeaders: "Origin, Content-Type, Accept",
		AllowCredentials: true,
	}))
	server.Get("/api/fetch_feed_amount", fetch_feed_amount_handler)
	server.Post("/api/register", register_handler)
	server.Post("/api/login", login_handler)
	port := os.Getenv("PORT")
	if port == "" {
		port = "42069"
	}
	log.Println("Server running on port: ", port)
	log.Fatal(server.Listen(":" + port))
}

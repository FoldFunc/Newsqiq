package main

import (
	"log"
	"os"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

var DB *gorm.DB

func initDB() {
	dsn := "host=localhost user=fold password=1234 dbname=newsqiq port=5432 sslmode=disable"
	var err error
	DB, err = gorm.Open(postgres.Open(dsn), &gorm.Config{})
	if err != nil {
		log.Fatal("Failed to connect to the DB: ", err)
	}
	// DB.AutoMigrate(&SomeStruct)
	log.Println("Connected to the DB")
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
	}))
	server.Get("/api/fetch_feed_amount", fetch_feed_amount_handler)

	port := os.Getenv("PORT")
	if port == "" {
		port = "42069"
	}
	log.Println("Server running on port: ", port)
	log.Fatal(server.Listen(":" + port))
}

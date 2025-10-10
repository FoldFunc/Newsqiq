import "./login-form.css"; // Make sure form.css is in the same folder or adjust the path

export default function FormLogin() {
  const handleSubmit = async (e) => {
    e.preventDefault()

    const formData = new FormData(e.target)
    const email = formData.get("email")
    const password = formData.get("password")
    const data = { email, password }
    try {
      const response = await fetch("http://localhost:42069/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
        credentials: "include",
      })
      if (!response.ok) {
        const errorData = await response.json()
        console.log("Error: ", errorData.error)
        return
      }
    } catch (e) {
      console.error(e)
      throw new Error(e)
    }
  }
  return (
    <div className="form-container">
      <h2>Login</h2>
      <form
        onSubmit={handleSubmit}
      >
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            placeholder="Your email"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            name="password"
            placeholder="Your password"
            required
          />
        </div>

        <button type="submit" className="submit-btn">
          Send Message
        </button>
      </form>
    </div>
  );
}


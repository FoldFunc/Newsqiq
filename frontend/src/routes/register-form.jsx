// Form.jsx
import "./register-form.css"; // Make sure form.css is in the same folder or adjust the path
export default function Form() {
  const handleSubmit = async (e) => {
    e.preventDefault()

    const formData = new FormData(e.target)
    const name = formData.get("name")
    const email = formData.get("email")
    const password = formData.get("password")
    const passwordConfirm = formData.get("passwordConfirm")
    console.log(password)
    console.log(passwordConfirm)
    if (password != passwordConfirm) {
      alert("Passwords do not match")
      return;
    }
    console.log({ name, email, password })
    const data = { name, email, password }
    try {
      const response = await fetch("http://localhost:42069/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })
      if (!response.ok) {
        const errorData = await response.json()
        console.log("Error: ", errorData.error)
        return
      }
      const result = await response.json()
      console.log(result)
    } catch (e) {
      console.error(e)
      throw new Error(e)
    }
  }
  return (
    <div className="form-container">
      <h2>Register</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="name">Name</label>
          <input
            type="text"
            id="name"
            name="name"
            placeholder="Your name"
            required
          />
        </div>

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

        <div className="form-group">
          <label htmlFor="passwordConfirm">Confirm password</label>
          <input
            type="password"
            id="passwordConfirm"
            name="passwordConfirm"
            placeholder="Confirm your password"
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


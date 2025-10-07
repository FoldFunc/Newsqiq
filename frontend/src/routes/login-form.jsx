import "./login-form.css"; // Make sure form.css is in the same folder or adjust the path

export default function FormLogin() {
  return (
    <div className="form-container">
      <h2>Login</h2>
      <form
        onSubmit={(e) => {
          e.preventDefault(); // Prevent page reload
          alert("Form submitted!"); // You can replace with your logic
        }}
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


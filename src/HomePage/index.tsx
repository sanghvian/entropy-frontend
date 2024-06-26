import { useNavigate } from 'react-router-dom'

const HomePage = () => {
    const navigate = useNavigate();
    return (
        <div
            style={{
                height: "100%",
                // minHeight: "94vh",
                width: "100%",
                backgroundColor: "#90A0B7",
                padding: "1.3rem",
                margin: "0",
                display: "flex",
                alignItems: "stretch",
                justifyContent: "stretch",
            }}
            onClick={() => {
                navigate("/cart");
            }}
        >
            <div
                style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    width: "100%",
                    borderRadius: "10px",
                    justifyContent: "center",
                    backgroundColor: "#fff",
                    boxShadow: "5px 5px 3px 0px rgba(0, 0, 0, 0.25)"
                }}
            >
                <img
                    src="https://testbucket1841.s3.ap-south-1.amazonaws.com/dump/entropy-logo-3.png"
                    alt="Entropy Logo"
                    style={{
                        width: "800px",
                        height: "auto",
                        background: "white",
                    }}
                />
                <h1
                    style={{
                        color: "#002F8E",
                        fontSize: "2.4rem",
                        marginBottom: "0",
                    }}
                >WELCOME TO THE FUTURE</h1>
                <h3
                    style={{
                        marginTop: "1rem",
                        color: "#90A0B7",
                        fontSize: "1.3rem",
                    }}
                >Tap the Screen to Get Started</h3>
            </div>
        </div>
    )
}

export default HomePage

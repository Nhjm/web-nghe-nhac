"use client";

import { useState, useRef } from "react";
import {
    Avatar,
    Box,
    Button,
    Card,
    Checkbox,
    Container,
    FormControlLabel,
    Link as MuiLink,
    TextField,
    Typography,
    Alert,
    InputAdornment,
    IconButton,
    Divider,
} from "@mui/material";
import LoginIcon from "@mui/icons-material/Login";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import GitHubIcon from "@mui/icons-material/GitHub";
import { signIn } from "next-auth/react";
import Link from "next/link";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useRouter } from "next/navigation";
import { SnackbarCloseReason } from "@mui/material/Snackbar";
import { SlideProps, Snackbar, Slide } from "@mui/material";

function SlideTransition(props: SlideProps) {
    return <Slide {...props} direction="left" />;
}
const AuthSignIn = () => {

    const router = useRouter();
    const passwordInputRef = useRef<HTMLInputElement>(null);

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [rememberMe, setRememberMe] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");

    const [isErrorUsername, setIsErrorUsername] = useState<boolean>(false);
    const [errorUsername, setErrorUsername] = useState<string>("");

    const [isErrorPassword, setIsErrorPassword] = useState<boolean>(false);
    const [ErrorPassword, setErrorPassword] = useState<string>("");

    const [isOpenError, setIsOpenError] = useState<boolean>(false);
    const [resMessage, setResMessage] = useState<string>("");
    const handleClose = (
        event?: React.SyntheticEvent | Event,
        reason?: SnackbarCloseReason,
    ) => {
        if (reason === "clickaway") {
            return;
        }

        setIsOpenError(false);
    };


    const handleSubmit = async () => {
        setIsLoading(true);

        setIsErrorUsername(false);
        setErrorUsername("");

        setIsErrorPassword(false);
        setErrorPassword("");

        if (!email) {
            setErrorUsername("Vui lòng nhập email hoặc tên đăng nhập");
            setIsErrorUsername(true);
        }

        if (!password) {
            setErrorPassword("Vui lòng nhập mật khẩu");
            setIsErrorPassword(true);
        }

        if (!email || !password) {
            setIsLoading(false);
            return;
        }

        const res = await signIn("credentials", {
            redirect: false,
            username: email,
            password: password,
        });
        console.log("check res", res);

        if (!res?.error) {
            router.push("/");
        } else {
            setResMessage(res.error);
            setIsOpenError(true);
        }

        setIsLoading(false);
    };

    return (
        <Box
            sx={{
                minHeight: "100vh",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                padding: 2,
            }}
        >
            <Container maxWidth="sm">
                <Card
                    sx={{
                        padding: 4,
                        boxShadow: "0 10px 40px rgba(0, 0, 0, 0.2)",
                        borderRadius: 3,
                    }}
                >
                    <Link href={"/"}>
                        <ArrowBackIcon />
                    </Link>
                    <Box
                        sx={{
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                        }}
                    >
                        <Avatar
                            sx={{
                                width: 56,
                                height: 56,
                                mb: 1,
                                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                            }}
                        >
                            <LoginIcon />
                        </Avatar>
                        <Typography
                            variant="h4"
                            component="h1"
                            sx={{
                                fontWeight: 700,
                                mb: 0.5,
                                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                                WebkitBackgroundClip: "text",
                                WebkitTextFillColor: "transparent",
                            }}
                        >
                            Đăng Nhập
                        </Typography>
                        <Typography variant="body2" color="text.secondary" align="center">
                            Chào mừng bạn quay lại
                        </Typography>
                    </Box>

                    {error && (
                        <Alert severity="error" sx={{ mb: 2 }}>
                            {error}
                        </Alert>
                    )}

                    <Box sx={{ mt: 1 }}>
                        <TextField
                            fullWidth
                            label="Email hoặc Tên đăng nhập"
                            type="email"
                            variant="outlined"
                            margin="normal"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            error={isErrorUsername}
                            helperText={errorUsername}
                            sx={{
                                "& .MuiOutlinedInput-root": {
                                    borderRadius: 2,
                                },
                            }}
                            onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                    passwordInputRef.current?.focus();
                                }
                            }}
                        />

                        <TextField
                            fullWidth
                            label="Mật khẩu"
                            type={showPassword ? "text" : "password"}
                            variant="outlined"
                            margin="normal"
                            value={password}
                            error={isErrorPassword}
                            helperText={ErrorPassword}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            inputRef={passwordInputRef}
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton
                                            onClick={() => setShowPassword(!showPassword)}
                                            edge="end"
                                        >
                                            {showPassword ? <VisibilityOff /> : <Visibility />}
                                        </IconButton>
                                    </InputAdornment>
                                ),
                            }}
                            sx={{
                                "& .MuiOutlinedInput-root": {
                                    borderRadius: 2,
                                },
                            }}
                            onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                    handleSubmit();
                                }
                            }}
                        />

                        <Box
                            sx={{
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                                my: 1,
                            }}
                        >
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        checked={rememberMe}
                                        onChange={(e) => setRememberMe(e.target.checked)}
                                    />
                                }
                                label="Ghi nhớ tôi"
                            />
                            <MuiLink
                                href="#"
                                underline="hover"
                                sx={{
                                    cursor: "pointer",
                                    color: "#667eea",
                                    fontSize: "0.875rem",
                                }}
                            >
                                Quên mật khẩu?
                            </MuiLink>
                        </Box>

                        <Button
                            fullWidth
                            variant="contained"
                            size="large"
                            type="submit"
                            disabled={isLoading}
                            onClick={handleSubmit}
                            sx={{
                                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                                borderRadius: 2,
                                textTransform: "none",
                                fontSize: "1rem",
                                fontWeight: 600,
                                py: 1.5,
                                "&:hover": {
                                    boxShadow: "0 8px 20px rgba(102, 126, 234, 0.4)",
                                },
                            }}
                        >
                            {isLoading ? "Đang đăng nhập..." : "Đăng Nhập"}
                        </Button>

                        <Divider sx={{ my: 1 }}>hoặc</Divider>

                        <Box
                            sx={{
                                display: "grid",
                                gridTemplateColumns: "1fr 1fr",
                                gap: 2,
                                mb: 2,
                            }}
                        >
                            <Button
                                fullWidth
                                variant="outlined"
                                size="large"
                                // onClick={handleGoogleLogin}
                                sx={{
                                    borderRadius: 2,
                                    textTransform: "none",
                                    fontSize: "0.95rem",
                                    fontWeight: 500,
                                    py: 1.2,
                                    borderColor: "#e0e0e0",
                                    color: "#1f2937",
                                    "&:hover": {
                                        backgroundColor: "rgba(0, 0, 0, 0.02)",
                                        borderColor: "#4285f4",
                                    },
                                }}
                            >
                                <svg
                                    width="20"
                                    height="20"
                                    viewBox="0 0 24 24"
                                    style={{ marginRight: 8 }}
                                >
                                    <path
                                        fill="#4285f4"
                                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                    />
                                    <path
                                        fill="#34a853"
                                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                    />
                                    <path
                                        fill="#fbbc05"
                                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                                    />
                                    <path
                                        fill="#ea4335"
                                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                                    />
                                </svg>
                                Google
                            </Button>

                            <Button
                                fullWidth
                                variant="outlined"
                                size="large"
                                onClick={() => signIn("github")}
                                sx={{
                                    borderRadius: 2,
                                    textTransform: "none",
                                    fontSize: "0.95rem",
                                    fontWeight: 500,
                                    py: 1.2,
                                    borderColor: "#e0e0e0",
                                    color: "#1f2937",
                                    "&:hover": {
                                        backgroundColor: "rgba(0, 0, 0, 0.02)",
                                        borderColor: "#333",
                                    },
                                }}
                            >
                                <GitHubIcon sx={{ marginRight: 1, fontSize: 20 }} />
                                GitHub
                            </Button>
                        </Box>

                        <Box sx={{ textAlign: "center" }}>
                            <Typography variant="body2" color="text.secondary">
                                Chưa có tài khoản?{" "}
                                <MuiLink
                                    href="/signup"
                                    underline="hover"
                                    sx={{
                                        cursor: "pointer",
                                        color: "#667eea",
                                        fontWeight: 600,
                                    }}
                                >
                                    Đăng Ký Ngay
                                </MuiLink>
                            </Typography>
                        </Box>
                    </Box>
                </Card>
            </Container>
            <Snackbar
                open={isOpenError}
                onClose={handleClose}
                autoHideDuration={1200}
                TransitionComponent={SlideTransition}
                anchorOrigin={{ vertical: "top", horizontal: "right" }}
            >
                <Alert
                    // onClose={handleClose}
                    severity="error"
                    variant="filled"
                    sx={{ width: "100%" }}
                >
                    {resMessage}
                </Alert>
            </Snackbar>
        </Box>
    );
};

export default AuthSignIn;

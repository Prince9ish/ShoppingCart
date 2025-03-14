import {Box, Button, Dialog, DialogActions, DialogContent, Typography} from "@mui/material";
import DoneRoundedIcon from "@mui/icons-material/DoneRounded";

interface ConfirmationDialogProps {
    orderId: string;
    isDialogShown: boolean;
    onDialogClose: () => void;
}

export const ConfirmationDialog = (props: ConfirmationDialogProps) => {
    return (
        <Dialog
            maxWidth="sm"
            open={props.isDialogShown}
            onClose={props.onDialogClose}
            sx={{
                "& .MuiPaper-root": {
                    borderRadius: "16px",
                    boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.1)",
                    overflow: "hidden",
                },
            }}
        >
            <Box
                sx={{
                    background: "#2ECC71",
                    height: "25rem",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    position: "relative",
                }}
            >
                {/* Background (Green) check - slightly bigger, slightly lower */}
                <DoneRoundedIcon
                    sx={{
                        fontSize: 100,
                        color: "#14A674",
                        fontWeight: 900,
                        position: "absolute",
                        left: "50%",
                        top: "50%",
                        transform: "translate(-65%, -55%)",
                        opacity: 0.7,
                    }}
                />

                <DoneRoundedIcon
                    sx={{
                        fontSize: 100,
                        color: "white",
                        fontWeight: 900,
                        position: "absolute",
                        left: "50%",
                        top: "50%",
                        transform: "translate(-50%, -50%)",
                    }}
                />
            </Box>
            <DialogContent sx={{ textAlign: "center", paddingTop: "3rem", paddingInline: "3rem" }}>
                <Typography variant="h6" fontWeight="bold">
                    Purchase Confirmed!
                </Typography>
                <Typography variant="body2" color="textSecondary" sx={{ paddingTop: "16px" }}>
                    Thank you for your purchase!<br />
                    Your order ID is{" "}
                    <span style={{ fontWeight: "bold", textTransform: "uppercase" }}>
            #{props.orderId}
          </span>.<br />
                    A confirmation email has been sent to your inbox. You can track your order in your account.
                </Typography>
            </DialogContent>
            <DialogActions sx={{ justifyContent: "space-around", paddingBottom: "2rem" }}>
                <Button
                    onClick={props.onDialogClose}
                    variant="contained"
                    sx={{
                        backgroundColor: "#ffffff",
                        color: "#000",
                        borderRadius: "24px",
                        textTransform: "none",
                        padding: "8px 24px",
                        fontSize: "14px",
                        transition: "all 250ms ease-in-out",
                        "&:hover": { backgroundColor: "#2ECC71", color: "#ffffff" },
                    }}
                >
                    Back To Shop
                </Button>
            </DialogActions>
        </Dialog>
    );
};


"use client";

import {useCallback, useEffect, useMemo, useState} from "react";
import styles from "./page.module.css";
import {ProductItem} from "@/component/ProductItem/ProductItem";
import {Box, Button, CircularProgress, Skeleton, TextField} from "@mui/material";
import CalculateRoundedIcon from "@mui/icons-material/CalculateRounded";
import CreditCardRoundedIcon from "@mui/icons-material/CreditCardRounded";
import {CartProvider, useCart} from "@/utils/CartReducer";
import {ConfirmationDialog} from "@/component/Dialog/ConfirmationDialog";
import {calculateCart, fetchProducts, placeOrder} from "@/network/service/ProductService";

function HomeContent() {
    // -----------------------------------------------------------------
    // Variables / State
    // -----------------------------------------------------------------
    const {cart, dispatch} = useCart();
    const cartCount = useMemo(() => cart.reduce((acc, item) => acc + item.quantity, 0), [cart]);

    // Loading State
    const [isProductListLoading, setIsProductListLoading] = useState(false);
    const [isCalculationLoading, setCalculationLoading] = useState(false);
    const [isOrderLoading, setOrderLoading] = useState(false);

    const [productList, setProductList] = useState<Product[]>([]);
    const [isCartValid, setIsCartValid] = useState(false);
    const [calculationResult, setCalculationResult] = useState<CalculateResponse | null>(null);
    const [memberNumber, setMemberNumber] = useState("");
    const [orderID, setOrderID] = useState("");
    const [isConfirmationShown, setConfirmDialog] = useState(false);
    // -----------------------------------------------------------------


    // -----------------------------------------------------------------
    // Fetch Products on Mount
    // -----------------------------------------------------------------
    const fetchProductList = useCallback(async () => {
        setIsProductListLoading(true);
        try {
            const productListData = await fetchProducts();
            setProductList(productListData);
        } catch (error) {
            console.error("Error fetching products:", error);
        } finally {
            setIsProductListLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchProductList()
    }, [fetchProductList]);

    // Invalidate cart calculation when cart changes
    useEffect(() => {
        setIsCartValid(false);
    }, [cart]);

    // -----------------------------------------------------------------
    // Network Functions
    // -----------------------------------------------------------------
    const onCalculateCart = useCallback(async () => {
        if (cart.length === 0) return;
        setCalculationLoading(true);
        try {
            const response = await calculateCart(cart, memberNumber);
            setCalculationResult(response);
            setIsCartValid(true);
        } catch (error) {
            console.error("Error calculating cart:", error);
        } finally {
            setCalculationLoading(false);
        }
    }, [cart, memberNumber]);

    const onPlaceOrder = useCallback(async () => {
        if (!calculationResult) return;
        setOrderLoading(true);
        try {
            const response = await placeOrder(cart, memberNumber, calculationResult.finalTotal);
            setOrderID(response.orderId ?? "");
            setConfirmDialog(true);
        } catch (error) {
            console.error("Error placing order:", error);
        } finally {
            setOrderLoading(false);
        }
    }, [cart, memberNumber, calculationResult]);

    // -----------------------------------------------------------------
    // Helper Functions
    // -----------------------------------------------------------------
    const onConfirmationClose = useCallback(() => {
        setCalculationResult(null);
        setIsCartValid(false);
        dispatch({type: "RESET_CART"});
        fetchProductList();
        setConfirmDialog(false);
    }, [dispatch, fetchProductList]);

    // -----------------------------------------------------------------
    // Render UI Functions
    // -----------------------------------------------------------------
    const renderShoppingCart = () => (
        <div className={styles.leftContainer}>
            <div className={styles.titleContainer}>
                <div className={styles.title}>Shopping Cart</div>
                <div className={styles.subtitle}>{cartCount} Items</div>
            </div>
            <div className={styles.divider}/>
            <div className={styles.mainContent}>
                <div className={styles.headerContainer}>
                    <div className={styles.largeHeader}>Product Details</div>
                    <div className={styles.regularHeader}>Quantity</div>
                    <div className={styles.regularHeader}>Price</div>
                    <div className={styles.regularHeader}>Total</div>
                </div>
                <div className={styles.productContainer}>
                    {isProductListLoading
                        ? [...Array(10)].map((_, index) => (
                            <Skeleton key={index} variant="rectangular" height={180} width="100%"/>
                        ))
                        : productList.map((product) => <ProductItem key={product._id} productDetails={product}/>)}
                </div>
            </div>
        </div>
    );

    const renderSummary = () => (
        <div className={styles.rightContainer}>
            <div className={styles.title}>Order Summary</div>
            <div className={styles.divider}/>
            <div className={styles.mainContent}>
                {isCartValid && (
                    <div className={styles.sectionContainer}>
                        <div className={styles.twoColumnContainer}>
                            <div className={styles.leftItem}>
                                <div className={styles.subtitle}>Items {cartCount}</div>
                            </div>
                            <div className={styles.rightItem}>
                                <div className={styles.subtitle}>
                                    ฿{calculationResult?.grandTotal.toFixed(2) ?? 0}
                                </div>
                            </div>
                        </div>
                    </div>
                )}
                <div className={styles.sectionContainer}>
                    <div className={styles.textBold}>Member Number</div>
                    <TextField
                        id="outlined-basic"
                        variant="outlined"
                        fullWidth
                        placeholder="Enter Your Rewards Card Member number"
                        sx={{backgroundColor: "#fff", mt: 1, mb: 3, borderRadius: 2}}
                        value={memberNumber}
                        onChange={(e) => setMemberNumber(e.target.value)}
                    />
                    <Box sx={{ position: 'relative'}}>
                        <Button
                            variant="contained"
                            size="large"
                            disableElevation
                            fullWidth
                            startIcon={<CalculateRoundedIcon/>}
                            onClick={onCalculateCart}
                            disabled={isCalculationLoading || cartCount < 1}
                            sx={{
                                paddingBlock: '12px',
                                backgroundColor: 'black',
                                color: 'white',
                                '&:hover': {
                                    backgroundColor: 'gray',
                                },
                            }}
                        >
                            Calculate
                        </Button>
                        <>{isCalculationLoading && (
                            <CircularProgress
                                size={24}
                                sx={{
                                    color: 'white',
                                    position: 'absolute',
                                    top: '50%',
                                    left: '50%',
                                    marginTop: '-12px',
                                    marginLeft: '-12px',
                                }}
                            />
                        )}
                        </>
                    </Box>
                </div>
                {isCartValid && (
                    <>
                        <div className={styles.divider}/>
                        {calculationResult?.totalDiscount > 0 && (
                            <div className={styles.sectionContainer}>
                                <div className={styles.twoColumnContainer}>
                                    <div className={styles.leftItem}>
                                        <div className={styles.subtitle}>Discount</div>
                                    </div>
                                    <div className={styles.rightItem}>
                                        <div className={styles.subtitle}>
                                            -฿{calculationResult?.totalDiscount.toFixed(2)}
                                        </div>
                                    </div>
                                </div>
                                <div className={styles.subSectionContainer}>
                                    {calculationResult?.discountItems.map((item) => (
                                        <div className={styles.twoColumnContainer} key={item.name}>
                                            <div className={styles.leftItem}>
                                                <div className={styles.text}>{item.name}</div>
                                            </div>
                                            <div className={styles.rightItem}>
                                                <div className={styles.text}>
                                                    -฿{item.discountAmount.toFixed(2)}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                    {calculationResult?.memberDiscount > 0 && (
                                        <div className={styles.subSectionContainer}>
                                            <div className={styles.twoColumnContainer}>
                                                <div className={styles.leftItem}>
                                                    <div className={styles.textBold}>Member Discount</div>
                                                </div>
                                                <div className={styles.rightItem}>
                                                    <div className={styles.textBold}>
                                                        -฿{calculationResult?.memberDiscount.toFixed(2)}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        <div className={styles.divider}/>
                        <div className={styles.sectionContainer}>
                            <div className={styles.twoColumnContainer}>
                                <div className={styles.leftItem}>
                                    <div className={styles.subtitle}>Final Amount</div>
                                </div>
                                <div className={styles.rightItem}>
                                    <div className={styles.subtitle}>
                                        ฿{calculationResult?.finalTotal.toFixed(2)}
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className={styles.divider}/>
                        <div className={styles.sectionContainer}>
                            <Box sx={{position: 'relative'}}>
                            <Button
                                variant="contained"
                                size="large"
                                disableElevation
                                fullWidth
                                startIcon={<CreditCardRoundedIcon/>}
                                disabled={!isCartValid || isOrderLoading}
                                onClick={onPlaceOrder}
                                sx={{
                                    paddingBlock: "16px",
                                    backgroundColor: "black"
                                }}
                            >
                                Place Order
                            </Button>
                                <>{isOrderLoading && (
                                    <CircularProgress
                                        size={24}
                                        sx={{
                                            color: 'white',
                                            position: 'absolute',
                                            top: '50%',
                                            left: '50%',
                                            marginTop: '-12px',
                                            marginLeft: '-12px',
                                        }}
                                    />
                                )}
                                </>
                            </Box>
                        </div>
                    </>
                )}
            </div>
        </div>
    );

    return (
        <div className={styles.page}>
            <ConfirmationDialog
                orderId={orderID}
                isDialogShown={isConfirmationShown}
                onDialogClose={onConfirmationClose}
            />
            {renderShoppingCart()}
            {renderSummary()}
        </div>
    );
}

export default function Home() {
    return (
        <CartProvider>
            <HomeContent/>
        </CartProvider>
    );
}

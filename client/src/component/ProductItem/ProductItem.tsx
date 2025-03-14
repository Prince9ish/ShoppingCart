"use client";

import Image from "next/image";
import styles from "./productItem.module.css";
import QuantitySelector from "@/component/QuantitySelector";
import React from "react";
import {useCart} from "@/utils/CartReducer";

interface ProductItemProps {
    productDetails: Product
}

export const ProductItem = (props: ProductItemProps) => {
    const {cart, dispatch} = useCart();

    const currentCartItem = cart.find(item => item.productId === props.productDetails._id);
    const quantity = currentCartItem ? currentCartItem.quantity : 0;

    const updateQuantity = (newQuantity: number) => {
        dispatch({
            type: "UPDATE_QUANTITY",
            payload: {productId: props.productDetails._id, quantity: newQuantity}
        });
    };

    return <div
        className={styles.container}
    >
        <div className={styles.largeContainer}>
            <Image
                className={styles.image}
                src={props.productDetails.imageURL}
                alt="Food Set Image"
                width={0}
                height={0}
                sizes="20vw"
                priority
            />
            <div className={styles.textContainer}>
                {props.productDetails.itemLimit == 0 ?<div
                    className={styles.description}
                >
                    UNAVAILABLE
                </div> : null
                }
                <div
                    className={styles.text}
                >
                    {props.productDetails.name}
                </div>

                <div
                    className={styles.description}
                >
                    {props.productDetails.description}
                </div>
            </div>

        </div>

        <div className={styles.regularContainer}>
            <QuantitySelector
                limit={props.productDetails.itemLimit}
                value={quantity}
                onValueChange={(val) => updateQuantity(val)}
            />
        </div>

        <div className={styles.regularContainer}>
            <div
                className={styles.text}
            >
                ฿{props.productDetails.price.toFixed(2)}
            </div>
        </div>


        <div className={styles.regularContainer}>
            <div
                className={styles.text}
            >
                ฿{(props.productDetails.price * quantity).toFixed(2)}
            </div>
        </div>


    </div>

}

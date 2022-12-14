import type { NextPage } from "next";
import { useEffect } from "react";
import { calculateTotals, getCartItems } from "../store/cart/cartSlice";
import Head from "next/head";
import Image from "next/image";
import styles from "../styles/Home.module.css";
import Navbar from "../components/Navbar";
import { useDispatch, useSelector } from "react-redux";
import CartContainer from "../components/CartContainer";
import Loading from "../components/Loading";
import Modal from "../components/Modal";
import { AppDispatch, AppState } from "../store/store";

const Home: NextPage = () => {
  const { cartItems, isLoading } = useSelector((store: AppState) => store.cart);
  const { isOpen } = useSelector((store: AppState) => store.modal);

  const dispatch = useDispatch<AppDispatch>();
  useEffect(() => {
    dispatch(calculateTotals());
  }, [cartItems]);
  useEffect(() => {
    dispatch(getCartItems());
  }, []);

  if (isLoading) {
    return <Loading />;
  }
  return (
    <div>
      <Head>
        <title>RedxToolkit App</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        {isOpen && <Modal />}

        <Navbar />
        <CartContainer />
      </main>
    </div>
  );
};

export default Home;

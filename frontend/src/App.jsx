import React from "react";
import "./App.css";
import Header from "./components/Header";
import Hero from "./components/Hero";
import SlideComp from "./components/SlideComp";
import Footer from "./components/Footer";

function App() {
  return (
    <div className="App">
      <Header />
      <Hero />
      <SlideComp />
      <Footer />
    </div>
  );
}

export default App;

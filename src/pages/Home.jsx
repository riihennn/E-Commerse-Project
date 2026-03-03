import Carousel from "../components/Carousel"
import Footer from "../components/Footer"
import Features from "../components/Features"
import FlipCardGrid from "../components/FlipCard"
import FirstProducts from "../components/FirstProducts"
import SecondProducts from "../components/SecondProducts"
import ThirdProducts from "../components/ThirdProducts"
import OurBrands from "../components/OurBrands"

export default function Home(){
    return(
        <>  
            <Carousel/>
            <ThirdProducts/>
            <SecondProducts/>
            <FirstProducts/>
            <FlipCardGrid/>
            <OurBrands/>
            <Features/>
            <Footer/>
        </>

    )
}
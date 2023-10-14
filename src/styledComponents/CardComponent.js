import "./cardStyles.css";
import { motion, Variants } from "framer-motion";

const cardVariants = {
    offscreen: {
        y: 300
    },
    onscreen: {
        y: 50,
        rotate: -10,
        transition: {
            type: "spring",
            bounce: 0.4,
            duration: 0.8
        }
    }
};

const hue = (h) => `hsl(${h}, 100%, 50%)`;

export default function Card({imgUrl, hueA, hueB, name }) {
    const background = `linear-gradient(306deg, ${hue(hueA)}, ${hue(hueB)})`;
    return (
        <motion.div
            className="card-container"
            initial="offscreen"
            whileInView="onscreen"
            viewport={{ once: true, amount: 0.8 }}
        >
            <div className="splash" style={{ background }} />
            <motion.div className="card" variants={cardVariants}>
                <h2 style={{ position : "absolute", fontSize : "20px", top : "0" }}>{name}</h2>
                <img src={process.env.PUBLIC_URL + '/' + imgUrl}></img>
            </motion.div>
        </motion.div>
    );
}

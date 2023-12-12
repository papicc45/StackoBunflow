import Card from "../styledComponents/CardComponent";
import {useState} from "react";
import Modal from "react-modal";

const img = [
    ['bun.png', 340, 10, 'Bun'],
    ['prisma.png', 20, 40, 'Prisma'],
    ['elysiajs.png', 60, 90, 'Elysia'],
    ['wsl.png', 80, 120, 'WSL'],
    ['gitaction.png', 100, 140, 'Git Action'],
    ['ec2.png', 205, 245, 'EC2'],
    ['rds.png', 260, 290, 'RDS'],
    // ["🍇", 290, 320]
];

const customStyles = {
    content: {
        top: '50%',
        left: '50%',
        right: 'auto',
        bottom: 'auto',
        marginRight: '-50%',
        transform: 'translate(-50%, -50%)',
    },
};

export default function MainPage() {
    let count = 1;
    const [modalIsOpen, setIsOpen] = useState(false);
    const [selectedImage,setSelectedImage] = useState(null);

    function openModal(image) {
        setIsOpen(true);
        setSelectedImage(image);
        console.log(selectedImage);
    }


    function closeModal() {
        setIsOpen(false);
        setSelectedImage(null);
    }
    return (
        <>
            {img.map(([imgUrl, hueA, hueB, name], index) =>
                <div onClick={() => openModal(`img${index + 1}`)}>
                     <Card imgUrl={imgUrl} hueA={hueA} hueB={hueB} key={imgUrl} name={name} />
                </div>
            )}
            <Modal
                isOpen={modalIsOpen}
                onRequestClose={closeModal}
                style={customStyles}
                contentLabel="Example Modal"
            >
                {selectedImage && <img src={`${process.env.PUBLIC_URL}/${selectedImage}.png`} alt="Selected" />}
            </Modal>
        </>
    )

}

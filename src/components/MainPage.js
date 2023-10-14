import Card from "../styledComponents/CardComponent";

const img = [
    ['bun.png', 999, 100, 'Bun'],
    ['prisma.png', 40, 500, 'Prisma'],
    ['elysiajs.png', 60, 90, 'Elysia'],
    ['wsl.png', 80, 120, 'WSL'],
    ['gitaction.png', 100, 140, 'Git Action'],
    ['ec2.png', 205, 245, 'EC2'],
    ['rds.png', 260, 290, 'RDS'],
    // ["🍇", 290, 320]
];

export default function MainPage() {
    return (
        <>
            {img.map(([imgUrl, hueA, hueB, name]) =>
                 <Card imgUrl={imgUrl} hueA={hueA} hueB={hueB} key={imgUrl} name={name} />
            )}
        </>
    )

}

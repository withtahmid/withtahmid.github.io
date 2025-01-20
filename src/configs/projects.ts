import { ProjectCard } from "../types/project";
const T:Record<string, string> = {
    express: "Express.js",
    JavaScript: "JavaScript",
    TypeScript: "TypeScript",
    tRPC: "tRPC",
    NodeJS: "NodeJS",
    React: "React.js",
    redux: "@redux/toolkit",
    MongoDB: "MongoDB",
    mongoose: "mongoose",

};


export const projectList:ProjectCard[] = [
    {
        title: "Mail Read Receipts",
        description: "Mail Read Receipts track when an email is opened, providing the exact time of access. This feature ensures confirmation of delivery and engagement, offering transparency in email communication. Ideal for professional settings, it helps monitor the recipient's interaction with important messages.",
        img: "/mailreadreceipts.webp",
        url: `/mailreadreceipts`,
        tech: [ T.TypeScript,T.express, T.NodeJS,  T.tRPC, T.React, T.redux, T.MongoDB]
    },
    {
        title: "Milkyway",
        description: "Not ready yet",
        img: "/milkywayIcon.webp",
        url: `/milkyway`,
        tech: [ ],
    },
]
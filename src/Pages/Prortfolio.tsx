import { Github, Linkedin, Mail, Phone } from "lucide-react";

export default function Portfolio() {
    const skills = {
        languages: ["TypeScript", "JavaScript", "C/C++", "Go", "Python"],
        backend: ["Node.js", "Express.js", "Socket.io", "tRPC"],
        databases: ["PostgreSQL", "MySQL", "MongoDB", "Redis"],
        streaming: ["Apache Kafka", "Debezium", "BullMQ"],
        devops: ["AWS", "Docker", "Cloudflare", "CI/CD", "GitHub Actions"],
    };

    const projects = [
        {
            name: "Bondhubot",
            link: "https://github.com/withtahmid/BondhuBot",
            desc: "Mental health chatbot using BDI, LLM and Langchain for depression detection",
            tech: "TypeScript, React, tRPC, Gemini",
        },
        {
            name: "ExamEase",
            link: "https://github.com/withtahmid/ExamEase",
            desc: "AI-driven LMS with auto-proctoring, automated grading, and micro-viva assessments",
            tech: "React.js, Node.js, Python Microservices",
        },
        {
            name: "Milkyway",
            link: "https://github.com/withtahmid/milkyway",
            desc: "Serverless web app for synchronized multi-user video playback with E2E encrypted chat",
            tech: "Vanilla JS, MQTT",
        },
    ];

    return (
        <div className="min-h-screen bg-zinc-900 text-zinc-100">
            <div className="max-w-4xl mx-auto px-6 py-16">
                {/* Header */}
                <header className="mb-16">
                    <h1 className="text-4xl font-bold mb-2">
                        Md Tahmid Ahmed Rakib
                    </h1>
                    <p className="text-xl text-zinc-400 mb-6">
                        Backend Engineer
                    </p>

                    <div className="flex flex-wrap gap-4 text-sm">
                        <a
                            href="mailto:withtahmid@gmail.com"
                            className="flex items-center gap-2 text-zinc-300 hover:text-white transition-colors"
                        >
                            <Mail size={16} />
                            withtahmid@gmail.com
                        </a>
                        <a
                            href="tel:+8801750716668"
                            className="flex items-center gap-2 text-zinc-300 hover:text-white transition-colors"
                        >
                            <Phone size={16} />
                            +880 1750-716668
                        </a>
                        <a
                            href="https://linkedin.com/in/withtahmid"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 text-zinc-300 hover:text-white transition-colors"
                        >
                            <Linkedin size={16} />
                            LinkedIn
                        </a>
                    </div>
                </header>

                {/* Experience */}
                <section className="mb-16">
                    <h2 className="text-2xl font-semibold mb-6 text-white border-b border-zinc-700 pb-2">
                        Experience
                    </h2>

                    <div>
                        <div className="flex justify-between items-start mb-2">
                            <h3 className="text-lg font-medium">
                                Software Engineer
                            </h3>
                            <span className="text-sm text-zinc-400">
                                Feb 2025 – Present
                            </span>
                        </div>
                        <p className="text-zinc-400 mb-4">FringeCore</p>

                        <ul className="space-y-2 text-zinc-300 text-sm">
                            <li>
                                • Built automated ERP and distribution systems
                                with TypeScript, tRPC, and PostgreSQL,
                                eliminating hundreds of hours of manual work
                                monthly
                            </li>
                            <li>
                                • Developed real-time CDC pipeline using
                                Debezium, Apache Kafka, and Go microservices for
                                system synchronization
                            </li>
                            <li>
                                • Deployed scalable infrastructure on AWS and
                                Cloudflare with CI/CD pipelines via GitHub
                                Actions
                            </li>
                        </ul>
                    </div>
                </section>

                {/* Skills */}
                <section className="mb-16">
                    <h2 className="text-2xl font-semibold mb-6 text-white border-b border-zinc-700 pb-2">
                        Skills
                    </h2>

                    <div className="space-y-4">
                        {Object.entries(skills).map(([category, items]) => (
                            <div key={category}>
                                <h3 className="text-sm font-medium text-zinc-400 uppercase tracking-wide mb-2">
                                    {category.replace(/([A-Z])/g, " $1").trim()}
                                </h3>
                                <div className="flex flex-wrap gap-2">
                                    {items.map((skill) => (
                                        <span
                                            key={skill}
                                            className="px-3 py-1 bg-zinc-800 text-zinc-300 text-sm rounded"
                                        >
                                            {skill}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Projects */}
                <section className="mb-16">
                    <h2 className="text-2xl font-semibold mb-6 text-white border-b border-zinc-700 pb-2">
                        Projects
                    </h2>

                    <div className="space-y-6">
                        {projects.map((project) => (
                            <div
                                key={project.name}
                                className="border border-zinc-800 p-4 rounded-lg hover:border-zinc-700 transition-colors"
                            >
                                <div className="flex items-center justify-between mb-2">
                                    <h3 className="text-lg font-medium">
                                        {project.name}
                                    </h3>
                                    <a
                                        href={project.link}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-zinc-400 hover:text-white transition-colors"
                                    >
                                        <Github size={20} />
                                    </a>
                                </div>
                                <p className="text-zinc-300 text-sm mb-2">
                                    {project.desc}
                                </p>
                                <p className="text-zinc-500 text-xs">
                                    {project.tech}
                                </p>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Achievements */}
                <section className="mb-16">
                    <h2 className="text-2xl font-semibold mb-6 text-white border-b border-zinc-700 pb-2">
                        Achievements
                    </h2>

                    <ul className="space-y-2 text-zinc-300 text-sm">
                        <li>
                            • Honorable Mention - ICPC Asia Dhaka Regional 2024
                            (Top 2,500+ teams)
                        </li>
                        <li>
                            • 12th Place - AtCoder Beginner Contest 338 (200+
                            participants)
                        </li>
                        <li>
                            • Judge & Problem Setter - Intra NSU Junior
                            Programming Contest 2023, 2024
                        </li>
                        <li>
                            • 1000+ algorithmic problems solved across various
                            online judges
                        </li>
                    </ul>
                </section>

                {/* Education */}
                <section className="mb-16">
                    <h2 className="text-2xl font-semibold mb-6 text-white border-b border-zinc-700 pb-2">
                        Education
                    </h2>

                    <div className="flex justify-between items-start">
                        <div>
                            <h3 className="text-lg font-medium">
                                BS in Computer Science and Engineering
                            </h3>
                            <p className="text-zinc-400">
                                North South University
                            </p>
                        </div>
                        <span className="text-sm text-zinc-400">2024</span>
                    </div>
                </section>

                {/* Footer */}
                <footer className="text-center text-zinc-500 text-sm pt-8 border-t border-zinc-800">
                    <p>© 2025 Md Tahmid Ahmed Rakib</p>
                </footer>
            </div>
        </div>
    );
}

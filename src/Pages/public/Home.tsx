import ProjectCard from "../../Components/cards/ProjectCard";
import { projectList } from "../../configs/projects";

const Home = () => {
    return (
        <section className="min-h-screen flex items-center justify-center">
            <div className="p-5">
                <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-2 gap-10">
                    {projectList.map((p) => (
                    <ProjectCard key={p.url} project={p} />
                    ))}
                </div>
            </div>
        </section>
    )
}
export default Home;
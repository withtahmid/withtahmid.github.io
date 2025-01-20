import { useNavigate } from "react-router-dom";
import { ProjectCard as PC } from "../../types/project";
const ProjectCard = ({ project }: { project:PC }) => {

    const navigate = useNavigate();
    const clickVisit = () => {
        navigate(project.url, { replace: true });
        // window.open(project.url, "_blank")
    }

    return (<div className="card lg:card-side bg-base-300 shadow-xl">
        <figure>
          <img
            height={400}
            width={400}
            src={project.img}
            alt="Album" />
        </figure>
        <div className="card-body">
          <h2 className="card-title">{project.title}</h2>
          <p className="max-w-md">{ project.description }</p>
          <div className="flex gap-2 max-w-md flex-wrap"> {project.tech.map(t => <kbd key={t} className="kbd">{t}</kbd>)} </div>
          <div className="card-actions justify-end">
            <button onClick={clickVisit} className="btn btn-primary">Visit</button>
          </div>
        </div>
      </div>)
}
export default ProjectCard;
import { useAppSelector } from "../../store";

const Home = () => {

    const name = useAppSelector(state => state.user.name);

    return <>Welcome { name }</>
}
export default Home;
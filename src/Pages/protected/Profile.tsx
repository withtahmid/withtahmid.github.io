import { useAppSelector } from "../../store";

const Profile = () => {

    const username = useAppSelector(state => state.user.user.username);
    const email = useAppSelector(state => state.user.user.email);
    const name = useAppSelector(state => state.user.user.name);


    return (
        <div>
            <h1>Username: {username}</h1>
            <h1>Name: {name}</h1>
            <h1>Email: {email}</h1>
        </div>

    )
}
export default Profile;
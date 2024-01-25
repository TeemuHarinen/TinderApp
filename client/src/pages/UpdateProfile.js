import { useCookies } from 'react-cookie'
import { useState, useEffect} from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import Nav from '../components/Nav'

const UpdateProfile = () => {
  const [cookies, setCookie, removeCookie] = useCookies(['user'])
  const [user, setUser] = useState(null)
  const userId = cookies.UserId
  const authToken = cookies.AuthToken
  let navigate = useNavigate()

  const [data, setData] = useState({
    user_id: cookies.UserId,
    first_name: "",
    dob_day: "",
    dob_month: "",
    dob_year: "",
    gender_identity: 'man',
    gender_interest: 'woman',
    url: '',
    about: ''
  })

  const getUser = async () => {
    try {
      const response = await axios.get('http://localhost:3001/user', {
        params: { userId }
      }) 
      setUser(response.data)
      console.log(response.data)
    } catch (err) {
      console.log(err)
    }
  }

  useEffect(() => {
    getUser()
  }, [])

  const handleChange = (event) => {
    let { id, value } = event.target;

    setData(prevState => ({
      ...prevState,
      [id]: value
    }));
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const response = await axios.put('http://localhost:3001/user', {
        data
      })
      if (response.status === 201) {
        navigate('/mainscreen')
      }
    } catch (err) {
      console.log(err)
    }
  }

  const handleBackout = () => {
    navigate('/mainscreen')
  }

  return (
    <>
      <Nav authToken={authToken} setShowModal={() => {}} showModal={false} />
      <h2 className="back-button"onClick={handleBackout}> Back </h2>
      <div className="welcome">
        <h2> Current info </h2>
        <h4> First name: {user?.first_name} </h4>
        <h4> Birthday: {user?.dob_day}/{user?.dob_month}/{user?.dob_year} </h4>
        <h4> Gender: {user?.gender_identity}</h4>
        <h4> Gender interest: {user?.gender_interest}</h4>
        <h4> About me: {user?.about}</h4>
        <h4> Picture URI: {user?.url}</h4>
        <h2> Update profile </h2>
        <form onSubmit={handleSubmit}>
          <section>
            <label htmlFor="first_name">First name</label>
            <input
              type="text"
              id="first_name"
              placeholder="first name"
              required={true}
              value={data.first_name}
              onChange={handleChange}
            />
            <label>Birthday</label>
            <div className="multiple-container">
              <input
                type="number"
                id="dob_day"
                placeholder="dd"
                required={true}
                value={data.dob_day}
                onChange={handleChange}
              />
              <input
                type="number"
                id="dob_month"
                placeholder="DD"
                required={true}
                value={data.dob_month}
                onChange={handleChange}
              />
              <input
                type="number"
                id="dob_year"
                placeholder="dd"
                required={true}
                value={data.dob_year}
                onChange={handleChange}
              />
            </div>

            <label>Gender</label>
            <div className="multiple-input-container">
              <input
                id="gender_identity"
                type="radio"
                name="gender_identity"
                value="man"
                onChange={handleChange}
                checked={data.gender_identity === 'man'}
              />
              <label htmlFor="man-gender-identity">Man</label>
              <input
                id="gender_identity"
                type="radio"
                name="gender_identity"
                value="woman"
                onChange={handleChange}
                checked={data.gender_identity === 'woman'}
              />
              <label htmlFor="woman-gender-identity">Woman</label>
            </div>
            <label> Show me </label>
            <div className="multiple-input-container">
            <input
                id="gender_interest"
                type="radio"
                name="gender_interest"
                value="man"
                onChange={handleChange}
                checked={data.gender_interest === 'man'}
              />
              <label htmlFor="man-gender-interest">Man</label>
              <input
                id="gender_interest"
                type="radio"
                name="gender_interest"
                value="woman"
                onChange={handleChange}
                checked={data.gender_interest === 'woman'}
              />
              <label htmlFor="woman-gender-interest">Woman</label>
            </div>
            <br/>
            <label htmlFor="about">About me</label>
            <input
              type="text"
              id="about"
              placeholder="Tell something about yourself!"
              required={true}
              value={data.about}
              onChange={handleChange}
            />
            <input className="primary-button" type="submit" id="submit"></input>
          </section>
          <section>
          <h3> Upload a picture</h3>
            <input
              name="url"
              type="url"
              id="url"
              required={true}
              value={data.url}
              onChange={handleChange}
            />
          <div className="picture-container">
            {data.url && <img src={data.url} alt="Preview "/>}
          </div>
          </section>
        </form>
      </div>
    </>
  )
}

export default UpdateProfile
import { useState, useEffect } from "react"
import { useCookies } from "react-cookie"
import { useNavigate } from "react-router-dom"
import axios from "axios"
import Nav from "../components/Nav"

// This page is rendered when the user first signs up, and is used to collect the user's information
const Welcome = () => {
  const [cookies, setCookies, removeCookies] = useCookies(['user'])
  const authToken = cookies.AuthToken
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

  let navigate = useNavigate()


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

  return (
    <>
      <Nav authToken={authToken} setShowModal={() => {}} showModal={false} />
      <div className="welcome">
        <h2> Create account</h2>
        <form onSubmit={handleSubmit}>
          <section>
            <label htmlFor="first_name">First name</label>
            <input
              type="text"
              data-cy="first_name"
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
                data-cy="dob_day"
                id="dob_day"
                placeholder="dd"
                required={true}
                value={data.dob_day}
                onChange={handleChange}
              />
              <input
                type="number"
                data-cy="dob_month"
                id="dob_month"
                placeholder="DD"
                required={true}
                value={data.dob_month}
                onChange={handleChange}
              />
              <input
                type="number"
                data-cy="dob_year"
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
                data-cy="gender_identity_man"
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
                data-cy="gender_identity_woman"
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
                data-cy="gender_interest_man"
                name="gender_interest"
                value="man"
                onChange={handleChange}
                checked={data.gender_interest === 'man'}
              />
              <label htmlFor="man-gender-interest">Man</label>
              <input
                id="gender_interest"
                data-cy="gender_interest_woman"
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
              data-cy="about"
              id="about"
              placeholder="Tell something about yourself!"
              required={true}
              value={data.about}
              onChange={handleChange}
            />
            <h4> Upload a picture</h4>
            <input
              name="url"
              data-cy="url"
              type="url"
              id="url"
              required={true}
              value={data.url}
              onChange={handleChange}
            />
          <div className="picture-container">
            {data.url && <img src={data.url} alt="Preview "/>}
          </div>
            <input className="primary-button" type="submit" id="submit"></input>
          </section>
        </form>
      </div>
    </>
  )
}

export default Welcome

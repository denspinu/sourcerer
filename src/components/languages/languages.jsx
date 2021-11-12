import React from "react";
import {useQuery, gql} from "@apollo/client";
import { Pie } from 'react-chartjs-2';
import './languages.css';


const SECOND_QUERY = gql`
query First {
    viewer {
      name
      location
      repositories(first: 30) {
        totalCount
        nodes {
          primaryLanguage {
            name
            color
          }
        }
      }
    }
  }
`;

function getLanguage(data) {
    const primaryLanguages = data.viewer.repositories.nodes.filter((item => item.primaryLanguage !== null));
    const primaryLanguage = primaryLanguages.map(item => {
        return [item.primaryLanguage.name, item.primaryLanguage.color];
    });

    let languages = new Map();
    primaryLanguage.forEach(element => {
        languages.set(element[0], element[1])
    });
    const nbLanguage = [];

    languages.forEach((value, key, map) => {
        let count = 0;
        primaryLanguage.forEach(item => {
            if (key === item[0]) {
                count++;
            }
        })
        nbLanguage.push(count);
    });

    const languageName = [];
    const languageColor = [];
    for (let languageEl of languages.keys())
        languageName.push(languageEl)

    for (let coloreEl of languages.values())
        languageColor.push(coloreEl);

    return {nbLanguage, languageColor, languageName};
}

const LanguagesChart = () => {
    const { loading, error, data } = useQuery(SECOND_QUERY);

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error :( {console.log(error  )}</p>;

    const {nbLanguage, languageColor, languageName} = getLanguage(data);
    const pieData = {
        labels: languageName, 
        datasets: [{
            data: nbLanguage, 
            backgroundColor: languageColor,
            borderColor: languageColor
        }]
    };

    return (
        <div id='lang' className='container'>
            <h2>Languages</h2>
            <Pie
                type='pie'
                data={pieData}
            />
        </div>
    )
}

export default LanguagesChart;
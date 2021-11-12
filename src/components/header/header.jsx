import {useQuery, gql} from "@apollo/client";
import photo from '../images/profil.jpg';
import './header.css';

const FIRST_QUERY = gql`
query First {
  viewer {
    name
    location
    repositories(first: 30) {
      totalCount
      edges {
        node {
          defaultBranchRef {
            target {
              ... on Commit {
                id
                history {
                  totalCount
                }
              }
            }
          }
        }
      }
      nodes {
        defaultBranchRef {
          target {
            ... on Commit {
              history {
                totalCount
                nodes {
                	additions
                  deletions
                }
              }
            }
          }
        }
      }
    }
    followers {
      totalCount
    }
    following {
      totalCount
    }
  }
}
`;


function Header() {
    const { loading, error, data } = useQuery(FIRST_QUERY);
    
    const linkedin = () => {
      window.location.href = "https://linkedin.com";
    };
    const facebook = () => {
      window.location.href = "https://facebook.com";
    };
    const twitter = () => {
      window.location.href = "https://twitter.com";
    };
  
    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error :( {console.log(error  )}</p>;


    let linesCode = data.viewer.repositories.nodes.map(element => element.defaultBranchRef)
    linesCode = linesCode.filter(element => element !== null)
    linesCode = linesCode.map(element => element.target.history.nodes.map(element => {
      return element.additions - element.deletions
    }))
    linesCode = linesCode.map(element => {
      return element.reduce((prev, curr) => prev + curr)
    })    

    let commits = data.viewer.repositories.edges.map(element => element.node.defaultBranchRef)
    commits = commits.filter(element => element !== null)
    commits = commits.map(element => element.target.history.totalCount)
    commits = commits.reduce((prev, curr) => {return prev + curr}) 


    return (
      <body>

      <div className="jumbotron text-center">
        <div id="redirection">
          <p>Share your profile on :</p>
          <button className="btn btn-light btn-sm" onClick={linkedin}>LinkedIn</button>
          <button className="btn btn-light btn-sm" onClick={facebook}>Facebook</button>
          <button className="btn btn-light btn-sm" onClick={twitter}>Twitter</button>
        </div>
        <h1>{data.viewer.name}</h1>
        <p>GitHub profile</p> 
      </div>
        
      <div className="container">
        <div className="row">
          <div id="test" className="col-sm-3 text-center" >
            <h4>Profile photo</h4>
            <p>
              <img src={photo} className="rounded-circle" alt="Photo" width="170" height="170"></img>
            </p>
          </div>
          <div className="col-sm-8">
            <p><b>Name :</b> {data.viewer.name}</p>
            <p><b>Location :</b> {data.viewer.location}</p>
            <ul className="list-group list-group-horizontal">
              <li className="list-group-item">Commits : {commits}</li>
              <li className="list-group-item">Repos : {data.viewer.repositories.totalCount}</li>
              <li className="list-group-item">Lines of lines : {linesCode}</li>
              <li className="list-group-item">Followers : {data.viewer.followers.totalCount}</li>
              <li className="list-group-item">Following : {data.viewer.following.totalCount}</li>
            </ul>
          </div>
        </div>
      </div>
      
      </body>
    );
  }

  export default Header;
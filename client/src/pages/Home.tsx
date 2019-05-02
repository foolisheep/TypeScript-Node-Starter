import React from "react";
import { Link } from "react-router-dom";

interface IProps {}
interface IStates {}
export default class Home extends React.Component<IProps, IStates> {
    render(): React.ReactElement<any> {
        return (
            <div className="container">
                <h1>Hackathon Starter</h1>
                <p className="lead">A boilerplate for Node.js web applications.</p>
                <hr/>
                <div className="row">
                    <div className="col-sm-6">
                        <h2>Heading</h2>
                        <p>Donec id elit non mi porta gravida at eget metus. Fusce dapibus, tellus ac cursus commodo, tortor mauris condimentum nibh, ut fermentum massa justo sit amet risus. Etiam porta sem malesuada magna mollis euismod. Donec sed odio dui.</p>
                        <p><Link className="btn btn-default" to="#" role="button">View details »</Link></p>
                    </div>
                    <div className="col-sm-6">
                        <h2>Heading</h2>
                        <p>Donec id elit non mi porta gravida at eget metus. Fusce dapibus, tellus ac cursus commodo, tortor mauris condimentum nibh, ut fermentum massa justo sit amet risus. Etiam porta sem malesuada magna mollis euismod. Donec sed odio dui.</p>
                        <p><Link className="btn btn-default" to="#" role="button">View details »</Link></p>
                    </div>
                    <div className="col-sm-6">
                        <h2>Heading</h2>
                        <p>Donec id elit non mi porta gravida at eget metus. Fusce dapibus, tellus ac cursus commodo, tortor mauris condimentum nibh, ut fermentum massa justo sit amet risus. Etiam porta sem malesuada magna mollis euismod. Donec sed odio dui.</p>
                        <p><Link className="btn btn-default" to="#" role="button">View details »</Link></p>
                    </div>
                    <div className="col-sm-6">
                        <h2>Heading</h2>
                        <p>Donec id elit non mi porta gravida at eget metus. Fusce dapibus, tellus ac cursus commodo, tortor mauris condimentum nibh, ut fermentum massa justo sit amet risus. Etiam porta sem malesuada magna mollis euismod. Donec sed odio dui.</p>
                        <p><Link className="btn btn-default" to="#" role="button">View details »</Link></p>
                    </div>
                </div>
            </div>
        );
    }
}
import React from "react";

interface IProps {
    location: Location;
}
interface IStates {}
export default class NotFound extends React.Component<IProps, IStates> {
    render(): React.ReactElement<any> {
        return (
            <div  className="container">
                <div className="page-header">
                    <h3>
                        Not found for <code>{this.props.location.pathname}</code>
                    </h3>
                </div>
            </div>
        );
    }
}
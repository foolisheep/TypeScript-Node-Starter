import React from "react";

interface Props {
    location: Location;
}
interface States {}
export default class NotFound extends React.Component<Props, States> {
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
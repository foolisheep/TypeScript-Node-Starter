import React from "react";

interface IProps {}

interface IStates {}
export default class Contact extends React.Component<IProps, IStates> {
    render(): React.ReactElement<any> {
        return (
            <div className="container">
                <div className="page-header">
                    <h3>Contact Form</h3>
                </div>
                <form className="form-horizontal" method="POST"><input type="hidden" name="_csrf" />
                    <div className="form-group"><label className="col-sm-2 control-label" htmlFor="name">Name</label>
                        <div className="col-sm-8"><input className="form-control" type="text" name="name" id="name" autoFocus={true} /></div>
                    </div>
                    <div className="form-group"><label className="col-sm-2 control-label" htmlFor="email">Email</label>
                        <div className="col-sm-8"><input className="form-control" type="text" name="email" id="email" /></div>
                    </div>
                    <div className="form-group"><label className="col-sm-2 control-label" htmlFor="message">Body</label>
                        <div className="col-sm-8"><textarea className="form-control" name="message" id="message" rows={7}></textarea></div>
                    </div>
                    <div className="form-group">
                        <div className="col-sm-offset-2 col-sm-8"><button className="btn btn-primary" type="submit"><i className="fa fa-envelope"></i>Send</button></div>
                    </div>
                </form>
            </div>
        );
    }
}
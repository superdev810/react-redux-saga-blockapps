import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import cx from 'classnames';
import treeChanges from 'tree-changes';
import moment from 'moment';

import { getRepos, showAlert, switchMenu } from 'actions';
import { STATUS } from 'constants/index';

import Loader from 'components/Loader';

export class GitHub extends React.Component {
  state = {
    query: 'react',
    username: '',
  };

  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    github: PropTypes.object.isRequired,
  };

  componentDidMount() {
    const { query } = this.state;
  }

  componentWillReceiveProps(nextProps) {
    const { dispatch } = this.props;
    const { changedTo } = treeChanges(this.props, nextProps);
  }

  handleClick = (e) => {
    const { username } = this.state;
    const { dispatch } = this.props;

    console.log(username);

    dispatch(getRepos(username));
  };

  handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      this.handleClick();
    }
  }
  render() {
    const { query } = this.state;
    const { github } = this.props;
    let output;

    console.log(github);

    if (github.repos.status === STATUS.READY || github.repos.status === STATUS.IDLE) {
      if (github.repos.data && github.repos.data.length > 0) {
        output = (
          <ul className={`app__github__grid app__github__grid`}>
            {github.repos.data
              .map(d => (
                <li key={d.id}>
                  <div className="app__github__item">
                    <div className="app__github__item__title">
                      <img src={d.actor.avatar_url} alt={d.actor.login} />
                      <div>
                        <strong>{d.actor.login}</strong> {d.type} to <b><a href={d.repo.url}>{d.repo.name}</a></b> {moment(d.created_at).fromNow()}
                      </div>
                    </div>
                    <div className="app__github__item__payload">

                    </div>
                  </div>
                </li>
              ))}
          </ul>
        );
      }
      else {
        output = <h3>Nothing found</h3>;
      }
    }
    else {
      output = <Loader />;
    }

    return (
      <div key="GitHub" className="app__github">
        <div className="app__github__selector">
          <div className="btn-group" role="group" aria-label="Basic example">
            <input 
              className="txt-username form-control" 
              type="text" 
              placeholder="Github username" 
              onChange={(e) => this.setState({ username: e.target.value })} 
              onKeyPress={(e) => this.handleKeyPress(e)}
            /> 
            <button
              type="button"
              className={cx('btn')}
              onClick={this.handleClick}
            >
              Get Github Public Events
            </button>
          </div>
        </div>
        {output}
      </div>
    );
  }
}

/* istanbul ignore next */
function mapStateToProps(state) {
  return { github: state.github };
}

export default connect(mapStateToProps)(GitHub);

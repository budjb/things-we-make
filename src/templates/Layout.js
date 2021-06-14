import React, { createRef, useState } from 'react';
import FancyHR from '../components/FancyHR';
import { graphql, Link, navigate, StaticQuery } from 'gatsby';
import { faBars } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import _ from 'lodash';

const buildCopyrightYears = () => {
  const startYear = 2021;
  const currentYear = new Date().getFullYear();

  if (startYear === currentYear) {
    return currentYear;
  } else {
    return `${startYear} - ${currentYear}`;
  }
};

const Layout = ({ children, className, query = '' }) => {
  const [showMenu, setShowMenu] = useState(false);
  const searchInput = createRef();

  const handleSearch = event => {
    event.preventDefault();
    const q = searchInput.current.value;

    if (q) {
      navigate(`/search?q=${q}`);
    } else {
      navigate('/');
    }
  };

  const props = {};

  if (className) {
    props.className = className;
  }

  return (
    <>
      <header>
        <Link to="/" className="title">
          Things We Make
        </Link>
        <div className={`menu ${showMenu && 'active'}`}>
          <div className="menu-button">
            <FontAwesomeIcon icon={faBars} onClick={() => setShowMenu(!showMenu)} />
          </div>
          <div className="menu-content">
            <div className="search">
              <form onSubmit={handleSearch}>
                <input type="text" defaultValue={query} ref={searchInput} placeholder="Search..." />
              </form>
            </div>
            <h3>Categories</h3>
            <StaticQuery
              query={graphql`
                query CategoriesQuery {
                  categories: allRecipe {
                    group(field: categories) {
                      fieldValue
                    }
                  }
                }
              `}
              render={data => (
                <ul>
                  {data.categories.group.map(it => (
                    <li>
                      <Link to={`/categories/${it.fieldValue}`}>{_.startCase(_.camelCase(it.fieldValue))}</Link>
                    </li>
                  ))}
                </ul>
              )}
            />
          </div>
        </div>
      </header>
      <FancyHR className="layout-header-divider" />
      <main {...props}>{children}</main>

      <FancyHR />

      <footer>
        Copyright &copy; {buildCopyrightYears()}{' '}
        <a href="https://budjb.dev" target="_blank" rel="noreferrer">
          Bud Byrd
        </a>
      </footer>
    </>
  );
};

export default Layout;

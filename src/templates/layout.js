import React, { createRef, useCallback, useEffect, useState } from 'react';
import { graphql, Link, navigate, StaticQuery } from 'gatsby';
import { formatCategorySlug } from '../util';

import logoIcon from '../images/logo-large.png';

import '../scss/layout.scss';
import { Helmet } from 'react-helmet';

const buildCopyrightYears = () => {
  const startYear = 2021;
  const currentYear = new Date().getFullYear();

  if (startYear === currentYear) {
    return currentYear;
  } else {
    return `${startYear} - ${currentYear}`;
  }
};

const Layout = ({ children, className, title, query = '' }) => {
  const searchInput = createRef();
  const [showOffCanvasNav, setShowOffCanvasNav] = useState(false);
  const offCanvasRef = createRef();

  const showNav = useCallback(() => {
    setShowOffCanvasNav(true);
  }, [setShowOffCanvasNav]);

  const hideNav = useCallback(() => {
    setShowOffCanvasNav(false);
  }, [setShowOffCanvasNav]);

  const handleMenuClick = useCallback(
    event => {
      if (offCanvasRef && !offCanvasRef.current.contains(event.target)) {
        setShowOffCanvasNav(false);
      }
    },
    [offCanvasRef, setShowOffCanvasNav]
  );

  const handleEscape = useCallback(
    event => {
      if (event.keyCode === 27 && showOffCanvasNav) {
        event.preventDefault();
        setShowOffCanvasNav(false);
      }
    },
    [showOffCanvasNav, setShowOffCanvasNav]
  );

  useEffect(() => {
    document.addEventListener('mousedown', handleMenuClick);
    document.addEventListener('keydown', handleEscape);

    return () => {
      document.removeEventListener('mousedown', handleMenuClick);
      document.removeEventListener('keydown', handleEscape);
    };
  });

  const handleSearch = event => {
    event.preventDefault();
    const q = searchInput.current.value;

    if (q) {
      navigate(`/search?q=${q}`);
    } else {
      navigate('/');
    }
  };

  const contentProps = ['container'];

  if (className) {
    contentProps.push(className);
  }

  return (
    <div className="min-vh-100 d-flex flex-column">
      <Helmet defaultTitle="Things We Make" titleTemplate="%s | Things We Make" bodyAttributes={{ class: 'bg-body' }}>
        <title>{title}</title>
        <meta name="robots" content="noindex,nofollow" />
      </Helmet>

      <header className="py-2 mb-3 mb-lg-5 container-fluid">
        <div className="d-flex justify-content-between align-content-center">
          <Link to="/" className="d-block">
            <img src={logoIcon} alt="Things We Make" className="mh-100" style={{height: '65px'}}/>
          </Link>
          <button type="button" className="btn border-0 py-0 px-2 shadow-none" onClick={showNav}>
            <i className={`bi bi-list btn text-dark p-0 fs-1`} />
          </button>
        </div>

        <div className={`offcanvas-collapse ${(showOffCanvasNav && 'open') || ''}`} ref={offCanvasRef}>
          <div className="d-flex justify-content-end my-3">
            <button
              type="button"
              className="btn-close btn-close-white shadow-none"
              aria-label="Close"
              onClick={hideNav}
            />
          </div>

          <form className="d-flex order-lg-2" onSubmit={handleSearch}>
            <input
              className="form-control rounded-pill shadow-none"
              type="search"
              defaultValue={query}
              ref={searchInput}
              placeholder="Search..."
            />
          </form>

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
              <nav className="nav flex-column mx-3 mt-4">
                {data.categories.group.map(({ fieldValue: slug }) => (
                  <Link key={slug} to={`/categories/${slug}`} className="nav-link text-light">
                    {formatCategorySlug(slug)}
                  </Link>
                ))}
                <Link to="/categories" className="nav-link text-light">
                  <small>More...</small>
                </Link>
              </nav>
            )}
          />
        </div>
      </header>

      <main className={contentProps.join(' ')}>{children}</main>

      <footer className="container py-5 fs-6 mt-auto text-muted text-center">
        Copyright &copy; {buildCopyrightYears()}{' '}
        <a href="https://budjb.dev" target="_blank" rel="noreferrer">
          Bud Byrd
        </a>
      </footer>
    </div>
  );
};

export default Layout;

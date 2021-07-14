import React from 'react';

const { Suspense } = React;

export default function Root(props) {

    return (
        <div className="app">
            <header className="header">
                <h1>Obstacle</h1>
                <ul className="menu">
                    <li><input type="text" name="search" placeholder="Search a player or a map..." /></li>
                    <li><a href="/">Home</a></li>
                    <li><a href="/">Servers</a></li>
                    <li><a href="/">Wiki</a></li>
                    <li><a href="/">Discord</a></li>
                </ul>
            </header>
            <section className="content">
                {/* Wrap the child in a Suspense boundary to allow rendering the
        layout even if the main content isn't ready */}
                <Suspense fallback={'Loading...'}>{props.children}</Suspense>
            </section>
        </div>
    );
}

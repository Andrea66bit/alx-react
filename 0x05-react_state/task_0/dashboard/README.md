Migration Guide for enzyme v2.x to v3.x
The change from enzyme v2.x to v3.x is a more significant change than in previous major releases, due to the fact that the internal implementation of enzyme has been almost completely rewritten.

The goal of this rewrite was to address a lot of the major issues that have plagued enzyme since its initial release. It was also to simultaneously remove a lot of the dependencies that enzyme has on React internals, and to make enzyme more "pluggable", paving the way for enzyme to be used with "React-like" libraries such as Preact and Inferno.

We have done our best to make enzyme v3 as API compatible with v2.x as possible, however there are a handful of breaking changes that we decided we needed to make, intentionally, in order to support this new architecture and also improve the usability of the library long-term.

Airbnb has one of the largest enzyme test suites, coming in at around 30,000 enzyme unit tests. After upgrading enzyme to v3.x in Airbnb's code base, 99.6% of these tests succeeded with no modifications at all. Most of the tests that broke we found to be easy to fix, and some we found to actually depend on what could arguably be considered a bug in v2.x, and the breakage was actually desired.

In this guide, we will go over a couple of the most common breakages that we ran into, and how to fix them. Hopefully this will make your upgrade path that much easier. If during your upgrade you find a breakage that doesn't seem to make sense to you, feel free to file an issue.

Configuring your Adapter
enzyme now has an "Adapter" system. This means that you now need to install enzyme along with another module that provides the Adapter that tells enzyme how to work with your version of React (or whatever other React-like library you are using).

At the time of writing this, enzyme publishes "officially supported" adapters for React 0.13.x, 0.14.x, 15.x, and 16.x. These adapters are npm packages of the form enzyme-adapter-react-{{version}}.

You will want to configure enzyme with the adapter you'd like to use before using enzyme in your tests. The way to do this is with enzyme.configure(...). For example, if your project depends on React 16, you would want to configure enzyme this way:

import Enzyme from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

Enzyme.configure({ adapter: new Adapter() });
The list of adapter npm packages for React semver ranges are as follows:

enzyme Adapter Package	React semver compatibility
enzyme-adapter-react-16	^16.4.0-0
enzyme-adapter-react-16.3	~16.3.0-0
enzyme-adapter-react-16.2	~16.2
enzyme-adapter-react-16.1	`~16.0.0-0 \	\	~16.1`
enzyme-adapter-react-15	^15.5.0
enzyme-adapter-react-15.4	15.0.0-0 - 15.4.x
enzyme-adapter-react-14	^0.14.0
enzyme-adapter-react-13	^0.13.0
Element referential identity is no longer preserved
enzyme's new architecture means that the react "render tree" is transformed into an intermediate representation that is common across all react versions so that enzyme can properly traverse it independent of React's internal representations. A side effect of this is that enzyme no longer has access to the actual object references that were returned from render in your React components. This normally isn't much of a problem, but can manifest as a test failure in some cases.

For example, consider the following example:

import React from 'react';
import Icon from './path/to/Icon';

const ICONS = {
  success: <Icon name="check-mark" />,
  failure: <Icon name="exclamation-mark" />,
};

const StatusLabel = ({ id, label }) => <div>{ICONS[id]}{label}{ICONS[id]}</div>;
import { shallow } from 'enzyme';
import StatusLabel from './path/to/StatusLabel';
import Icon from './path/to/Icon';

const wrapper = shallow(<StatusLabel id="success" label="Success" />);

const iconCount = wrapper.find(Icon).length;
In v2.x, iconCount would be 1. In v3.x, it will be 2. This is because in v2.x it would find all of the elements matching the selector, and then remove any duplicates. Since ICONS.success is included twice in the render tree, but it's a constant that's reused, it would show up as a duplicate in the eyes of enzyme v2.x. In enzyme v3, the elements that are traversed are transformations of the underlying react elements, and are thus different references, resulting in two elements being found.

Although this is a breaking change, I believe the new behavior is closer to what people would actually expect and want. Having enzyme wrappers be immutable results in more deterministic tests that are less prone to flakiness from external factors.

Calling props() after a state change
In enzyme v2, executing an event that would change a component state (and in turn update props) would return those updated props via the .props method.

Now, in enzyme v3, you are required to re-find the component; for example:

class Toggler extends React.Component {
  constructor(...args) {
    super(...args);
    this.state = { on: false };
  }

  toggle() {
    this.setState(({ on }) => ({ on: !on }));
  }

  render() {
    const { on } = this.state;
    return (<div id="root">{on ? 'on' : 'off'}</div>);
  }
}

it('passes in enzyme v2, fails in v3', () => {
  const wrapper = mount(<Toggler />);
  const root = wrapper.find('#root');
  expect(root.text()).to.equal('off');

  wrapper.instance().toggle();

  expect(root.text()).to.equal('on');
});

it('passes in v2 and v3', () => {
  const wrapper = mount(<Toggler />);
  expect(wrapper.find('#root').text()).to.equal('off');

  wrapper.instance().toggle();

  expect(wrapper.find('#root').text()).to.equal('on');
});
children() now has slightly different meaning
enzyme has a .children() method which is intended to return the rendered children of a wrapper.

When using mount(...), it can sometimes be unclear exactly what this would mean. Consider for example the following react components:

class Box extends React.Component {
  render() {
    const { children } = this.props;
    return <div className="box">{children}</div>;
  }
}

class Foo extends React.Component {
  render() {
    return (
      <Box bam>
        <div className="div" />
      </Box>
    );
  }
}
Now lets say we have a test which does something like:

const wrapper = mount(<Foo />);
At this point, there is an ambiguity about what wrapper.find(Box).children() should return. Although the <Box ... /> element has a children prop of <div className="div" />, the actual rendered children of the element that the box component renders is a <div className="box">...</div> element.

Prior enzyme v3, we would observe the following behavior:

wrapper.find(Box).children().debug();
// => <div className="div" />
In enzyme v3, we now have .children() return the rendered children. In other words, it returns the element that is returned from that component's render function.

wrapper.find(Box).children().debug();
// =>
// <div className="box">
//   <div className="div" />
// </div>
This may seem like a subtle difference, but making this change will be important for future APIs we would like to introduce.

find() now returns host nodes and DOM nodes
In some cases find will return a host node and DOM node. Take the following for example:

const Foo = () => <div/>;
const wrapper = mount(
  <div>
    <Foo className="bar" />
    <div className="bar"/>
   </div>
);
console.log(wrapper.find('.bar').length); // 2
Since <Foo/> has the className bar it is returned as the hostNode. As expected the <div> with the className bar is also returned

To avoid this you can explicity query for the DOM node: wrapper.find('div.bar'). Alternatively if you would like to only find host nodes use hostNodes()

For mount, updates are sometimes required when they weren't before
React applications are dynamic. When testing your react components, you often want to test them before and after certain state changes take place. When using mount, any react component instance in the entire render tree could register code to initiate a state change at any time.

For instance, consider the following contrived example:

import React from 'react';

class CurrentTime extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      now: Date.now(),
    };
  }

  componentDidMount() {
    this.tick();
  }

  componentWillUnmount() {
    clearTimeout(this.timer);
  }

  tick() {
    this.setState({ now: Date.now() });
    this.timer = setTimeout(tick, 0);
  }

  render() {
    const { now } = this.state;
    return <span>{now}</span>;
  }
}
In this code, there is a timer that continuously changes the rendered output of this component. This might be a reasonable thing to do in your application. The thing is, enzyme has no way of knowing that these changes are taking place, and no way to automatically update the render tree. In enzyme v2, enzyme operated directly on the in-memory representation of the render tree that React itself had. This means that even though enzyme couldn't know when the render tree was updated, updates would be reflected anyway, since React does know.

enzyme v3 architecturally created a layer where React would create an intermediate representation of the render tree at an instance in time and pass that to enzyme to traverse and inspect. This has many advantages, but one of the side effects is that now the intermediate representation does not receive automatic updates.

enzyme does attempt to automatically "update" the root wrapper in most common scenarios, but these are only the state changes that it knows about. For all other state changes, you may need to call wrapper.update() yourself.

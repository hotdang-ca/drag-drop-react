import React from 'react';
import PropTypes from 'prop-types';

const SCHEDULE_ITEMS = [
  {
    name: 'Swift',
  },
  {
    name: 'ATMS',
  },
  {
    name: 'EBS',
  },
  {
    name: 'iHomeFitness',
  },
  {
    name: 'POCUS',
  },
  {
    name: 'Hoolima',
  },
  {
    name: 'ORA',
  },
  {
    name: 'WinRyde',
  },
  {
    name: 'LocationTracker',
  },
];

class App extends React.Component {
  state = {
    todaysSchedule: {
      availableItem0: {
        timeStart: '0900',
        timeEnd: '1100',
      },
      availableItem1: {
        timeStart: '1100',
        timeEnd: '1300',
      },
      availableItem2: {
        timeStart: '1300',
        timeEnd: '1500',
      },
      availableItem3: {
        timeStart: '1500',
        timeEnd: '1700',
      },
    },

    currentHoverElement: undefined,
  };

  _allowDrop = (event) => {
    event.preventDefault();
    const { currentHoverElement }= this.state;

    const hoverElement = event.target.id;
    if (hoverElement !== currentHoverElement) {
      this.setState({
        currentHoverElement: hoverElement,
      });
    }
  }

  _checkScheduleForDuplicate = (scheduleItem) => {
    const { todaysSchedule } = this.state;

    let isDuplicate = false;
    Object.keys(todaysSchedule).forEach((key) => {
      const todaysScheduleItem = todaysSchedule[key];
      if (todaysScheduleItem.name === scheduleItem.name) {
        isDuplicate = true;
      }
    });

    return isDuplicate;
  }

  _deleteScheduledItem = (itemName) => {
    const { todaysSchedule } = this.state;

    Object.keys(todaysSchedule).forEach((key) => {
      const todaysScheduleItem = todaysSchedule[key];

      if (todaysScheduleItem.name === itemName) {
        this.setState({
          todaysSchedule: {
            ...this.state.todaysSchedule,
            [key]: {
              ...todaysScheduleItem,
              name: undefined,
            }
          }
        });
      }
    });
  }

  _drag = (event) => {
    const { availableScheduleItems } = this.props;

    // this targetId has a number... let's grab it
    const targetId = parseInt(event.target.id.match(/\d/), 10);

    // serialize first
    // send to dataTransfer API what i am dragging
    const objectSerialized = JSON.stringify(availableScheduleItems[targetId]);
    event.dataTransfer.setData('scheduleItem', objectSerialized);
  }

  // when an item is no longer dragged here, but the drag continues.
  _dragExit = (event) => {
    this.setState({
      currentHoverElement: undefined,
    });
  }

  _drop = (event) => {
    event.preventDefault();

    // retrieve from dataTransfer API what is being dropped
    const scheduleItemJSON = event.dataTransfer.getData('scheduleItem');
    const scheduleItem = JSON.parse(scheduleItemJSON);
    const target = event.target.id;

    // check for duplicate
    if (! this._checkScheduleForDuplicate(scheduleItem)) {
      this.setState({
        todaysSchedule: {
          ...this.state.todaysSchedule,
          [target]: {
            ...this.state.todaysSchedule[target],
            name: scheduleItem.name,
          },
        },
        currentHoverElement: undefined,
      });
    } else {
      alert(`${scheduleItem.name} is already scheduled for today`);

      this.setState({
        currentHoverElement: undefined,
      });
    }
  }

  _renderSchedulableItems = (items) => {
    return items.map((schedulableItem, index) => {
      return (
        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            margin: 8,
            backgroundColor: '#00ef00',
            height: 44,
            width: 200
          }}
          draggable={true}
          key={schedulableItem.name}
          id={`block${index}`}
          onDragStart={this._drag}
        >{ schedulableItem.name }</div>
      )
    });
  }

  _renderTodaysScheduleCode = (schedule) => {
    // assuming schedule is an object
    return (
      <div style={{ backgroundColor: '#dfdfdf', padding: 8, width: 250 }}>
        <pre>
          { JSON.stringify(schedule, null, ' ') }
        </pre>
      </div>
    )
  }

  _renderTodaysSchedule = (schedule, hoveredElement) => {
    return Object.keys(schedule).map((item, index) => {
      const destinationItem = `availableItem${index}`;
      const scheduledItem = schedule[item];

      const calculatedStyle = {
        color: '#000',
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        margin: 8,
        backgroundColor: '#fff',
        border: '#000',
        borderWidth: 1,
        borderStyle: 'solid',
        height: 44,
        width: 200,
      };

      if (scheduledItem.name) {
        calculatedStyle.backgroundColor = '#ff0000';
        calculatedStyle.color = '#fff';
        calculatedStyle.borderWidth = 2;
      }

      if (hoveredElement === destinationItem) {
        calculatedStyle.backgroundColor = '#8a0000';
        calculatedStyle.color = '#fff';
      }

      return (
        <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center'}}>
          <span
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              height: 44,
              width: 44,
              backgroundColor: '#fff',
              border: '1px solid #000',
              fontSize: 8,
              color: '#000',
              textAlign: 'center',
            }}
          >
            { scheduledItem.timeStart }
            <br />
            &mdash;<br />
            { scheduledItem.timeEnd }
          </span>
          <div
            style={calculatedStyle}
            id={`availableItem${index}`}
            onDrop={this._drop}
            key={item.name || index}
            onDragOver={this._allowDrop}
            onDragLeave={this._dragExit}
          >
            {
              scheduledItem.name || 'Available'
            }
          </div>

          {
            scheduledItem.name
            ?
            <span
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                height: 44,
                width: 44,
                backgroundColor: '#fff',
                border: '1px solid #000',
                fontSize: 16,
                color: '#000',
                textAlign: 'center',
                cursor: 'pointer',
              }}
              onClick={() => { this._deleteScheduledItem(scheduledItem.name) }}
            >X</span>
            : null
          }
        </div>
      );
    })
  }

  render() {
    const {
      todaysSchedule,
      currentHoverElement,
    } = this.state;
    const {
      availableScheduleItems,
    } = this.props;

    return (
      <div className="App">
        <h2>Available Items</h2>
        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
            flexWrap: 'wrap',
            backgroundColor: '#f0f0f0',
          }}>
          { this._renderSchedulableItems(availableScheduleItems) }
        </div>

        <h2>Today's Schedule</h2>
        <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-around' }}>
          <div style={{ display: 'flex', flexDirection: 'column', flexWrap: 'wrap' }}>
            { this._renderTodaysSchedule(todaysSchedule, currentHoverElement) }
          </div>

          <div>
            { this._renderTodaysScheduleCode(todaysSchedule)}
          </div>
        </div>
      </div>
    );
  }
}

App.propTypes = {
  availableScheduleItems: PropTypes.array,
};

App.defaultProps = {
  availableScheduleItems: SCHEDULE_ITEMS,
};

export default App;

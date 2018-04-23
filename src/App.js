import React from 'react';

class App extends React.Component {
  state = {
    availableScheduleItems: [
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
    ],

    todaysSchedule: {
      availableItem1: {
        timeStart: '0900',
        timeEnd: '1100',
      },
      availableItem2: {
        timeStart: '1100',
        timeEnd: '1300',
      },
      availableItem3: {
        timeStart: '1300',
        timeEnd: '1500',
      },
      availableItem4: {
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

  _drag = (event) => {
    const { availableScheduleItems } = this.state;

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

  _renderTodaysSchedule = (schedule, hoveredElement) => {
    return Object.keys(schedule).map((item, index) => {
      const destinationItem = `availableItem${index + 1}`;
      const scheduledItem = schedule[item];
      console.log('schedule', schedule);

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
        <div
          style={calculatedStyle}
          id={`availableItem${index + 1}`}
          onDrop={this._drop}
          key={item.name || index}
          onDragOver={this._allowDrop}
          onDragLeave={this._dragExit}
        >
          {
            scheduledItem.name || 'Available'
          }
      </div>
      );
    })
  }

  render() {
    const {
      availableScheduleItems,
      todaysSchedule,
      currentHoverElement,
    } = this.state;

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

        <h2>Todays Schedule</h2>
        <div style={{ display: 'flex', flexDirection: 'column', flexWrap: 'wrap' }}>
          { this._renderTodaysSchedule(todaysSchedule, currentHoverElement) }
        </div>
      </div>
    );
  }
}

export default App;

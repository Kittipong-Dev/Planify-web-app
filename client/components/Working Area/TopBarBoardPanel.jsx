import '/styles/panel.css'

const OffsetComponent = ({BoardName,BoardDesc}) => {
    return (
      <div className="offsetComponent">
        <div className='front'>
            <div className='title'>
                {BoardName}
            </div>
            <div>
                {BoardDesc}
            </div>
        </div>
        <div className='back'>
            <div>
                1
            </div>
            <div>
                2
            </div>
        </div>
      </div>
    );
  };
  
  export default OffsetComponent;
import { useState, useEffect , memo,Fragment} from 'react'

//react-bootstrap
import { Offcanvas, Row, Col} from 'react-bootstrap'

// Redux Selector / Action
import { useSelector } from 'react-redux';

// Import selectors & action from setting store
import * as SettingSelector from '../../store/setting/selectors'

// Section Components
// Style Setting Section Components
import ThemeScheme from './sections/theme-scheme'

const SettingOffCanvas = memo((props) => {

    const [show, setShow] = useState(false);

    // Define selectors
    const themeScheme = useSelector(SettingSelector.theme_scheme)
    const themeSchemeDirection = useSelector(SettingSelector.theme_scheme_direction)



    useEffect(() => {
        const onClick = (e) => {
            if(show) {
                if(e.target.closest('.live-customizer') == null && e.target.closest('#settingbutton') == null) {
                    setShow(false)
                }
            }
        };
        document.body.addEventListener("click", onClick);
    
        return () => {
            document.body.removeEventListener("click", onClick);
        };
    })
    return (
        <Fragment>
            <div className="btn btn-fixed-end btn-danger btn-icon btn-setting" onClick={(e) => {e.stopPropagation();setShow(true)}} >
            <span className="icon material-symbols-outlined animated-rotate text-white">
          settings
      </span>
            </div>

            <Offcanvas show={show} onHide={() => setShow(false)} placement={`${themeSchemeDirection === "rtl" ? 'start' : 'end'}`} backdrop={false} scroll={true} className="live-customizer">
                <Offcanvas.Header closeButton className="pb-0">
                    <div className="d-flex align-items-center">
                        <h4 className="offcanvas-title" id="live-customizer-label">Setting Panel</h4>
                    </div>
                </Offcanvas.Header>
                <Offcanvas.Body>
                    <Row>
                        <Col lg={12}>
                            <div>
                                <div className="text-center mb-4">
                                    <h5 className="d-inline-block">Style Setting</h5>
                                </div>
                                <div>
                                    <ThemeScheme themeScheme={themeScheme}></ThemeScheme>
                                </div>
                            </div>
                        </Col>
                    </Row>
                </Offcanvas.Body>
            </Offcanvas>
        </Fragment>
    )
})

SettingOffCanvas.displayName = 'SettingOffCanvas'
export default SettingOffCanvas

import React from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';

const TermsofService = () => {
    return (
        <div className='content-inner'>
            <Container>
                <Row>
                    <Col lg="12">
                        <Card className="mt-5">
                            <Card.Header className="clearfix d-flex justify-content-between pb-0">
                                <div className="header-title">
                                    <h4 className="card-title">Términos de Servicio</h4>
                                </div>
                            </Card.Header>
                            <Card.Body>
                                <h5>1. Aceptación de Términos</h5>
                                <p>Al utilizar nuestra aplicación, que integra servicios de streaming musical con funciones de red social, usted acepta cumplir con los presentes Términos de Servicio. Si no está de acuerdo con estos términos, no utilice la aplicación.</p>

                                <h5>2. Descripción del Servicio</h5>
                                <p>Nuestra aplicación permite a los usuarios conectar sus cuentas de Spotify para compartir su actividad musical, interactuar con otros usuarios, y recibir recomendaciones basadas en las preferencias de amigos y la comunidad. La aplicación se desarrolla utilizando React para la interfaz de usuario y Firebase para el almacenamiento de datos.</p>

                                <h5>3. Registro y Acceso</h5>
                                <p>Para utilizar nuestra aplicación, debe iniciar sesión con su cuenta de Spotify. Usted es responsable de mantener la confidencialidad de sus credenciales de inicio de sesión y de todas las actividades que ocurran bajo su cuenta. Nos reservamos el derecho de suspender o terminar su acceso si se detecta un uso no autorizado.</p>

                                <h5>4. Uso de la Aplicación</h5>
                                <p>Usted se compromete a utilizar la aplicación de manera responsable y a no violar los derechos de otros usuarios ni las leyes aplicables. Queda prohibido el uso de la aplicación para cualquier actividad ilegal, dañina, o que infrinja los derechos de terceros.</p>

                                <h5>5. Privacidad y Recolección de Datos</h5>
                                <p>Nuestra política de privacidad detalla cómo recopilamos y utilizamos los datos de los usuarios. Al utilizar la aplicación, usted acepta la recolección y uso de sus datos conforme a lo establecido en nuestra política de privacidad.</p>

                                <h5>6. Contenido de Usuarios</h5>
                                <p>Los usuarios pueden compartir contenido, como listas de reproducción, comentarios, y reacciones, a través de la aplicación. Usted conserva los derechos sobre el contenido que crea, pero nos otorga una licencia no exclusiva para usar, reproducir, y distribuir dicho contenido dentro de la aplicación.</p>

                                <h5>7. Limitación de Responsabilidad</h5>
                                <p>La aplicación se proporciona "tal cual" y no ofrecemos garantías de ningún tipo en cuanto a su funcionamiento, disponibilidad, o resultados obtenidos del uso. No seremos responsables por ningún daño directo, indirecto, incidental, o consecuente derivado del uso de la aplicación.</p>

                                <h5>8. Modificaciones al Servicio</h5>
                                <p>Nos reservamos el derecho de modificar o descontinuar la aplicación, temporal o permanentemente, en cualquier momento y sin previo aviso. También podemos actualizar estos Términos de Servicio cuando sea necesario.</p>

                                <h5>9. Terminación</h5>
                                <p>Podemos suspender o terminar su acceso a la aplicación en cualquier momento y por cualquier motivo, incluyendo, pero no limitado a, el incumplimiento de estos Términos de Servicio. Usted puede dejar de usar la aplicación en cualquier momento.</p>

                                <h5>10. Ley Aplicable</h5>
                                <p>Estos Términos de Servicio se regirán e interpretarán de acuerdo con las leyes aplicables en la jurisdicción correspondiente. Cualquier disputa relacionada con estos términos será sometida a la jurisdicción exclusiva de los tribunales competentes.</p>

                                <p>Al continuar utilizando la aplicación, usted reconoce que ha leído, comprendido, y aceptado estos Términos de Servicio.</p>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </Container>
        </div>
    );
}

export default TermsofService;

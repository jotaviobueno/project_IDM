import ip from "ip";

export default function compareSession(session, userAgent) {
	const requestIp = ip.address();

	if ( session.address_ip === requestIp && session.user_agent === userAgent )
		return true;

	return false;
}
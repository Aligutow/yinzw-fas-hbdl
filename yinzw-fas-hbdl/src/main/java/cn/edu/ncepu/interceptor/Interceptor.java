package cn.edu.ncepu.interceptor;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerInterceptor;
import org.springframework.web.servlet.ModelAndView;
@Component
public class Interceptor implements HandlerInterceptor{

	@Value("${server.context-path}")
	private String contextPath;
	@Value("${app.login-path}")
	private String loginPath;
	@Override
	public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler)
			throws Exception {
		String uri = request.getRequestURI().toString();
		//验证SESSION
		System.out.println(uri);
		
		HttpSession session = request.getSession();
		if (session.getAttribute("USER_CONTEXT") == null) {
			response.setStatus(HttpStatus.UNAUTHORIZED.value());
			System.out.println(HttpStatus.UNAUTHORIZED.value());
			//response.sendRedirect(contextPath+loginPath);
			return false;
		}
		if (session.getAttribute("USER_CONTEXT") == null) {
			response.setStatus(HttpStatus.UNAUTHORIZED.value());
			//response.sendRedirect(contextPath+loginPath);//redirect后，前台认为是200
			System.out.println(HttpStatus.UNAUTHORIZED.value());
			return false;
		}
		
		return true;
	}

	@Override
	public void postHandle(HttpServletRequest request, HttpServletResponse response, Object handler,
			ModelAndView modelAndView) throws Exception {
		// TODO Auto-generated method stub
		
	}

	@Override
	public void afterCompletion(HttpServletRequest request, HttpServletResponse response, Object handler, Exception ex)
			throws Exception {
		// TODO Auto-generated method stub
		
	}

}

package cn.edu.ncepu;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.InterceptorRegistry;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurerAdapter;

import cn.edu.ncepu.interceptor.Interceptor;

@Configuration
public class ApplicationConfig extends WebMvcConfigurerAdapter {
	@Autowired
	private Interceptor interceptor;
	
	/**
	 * 添加拦截器,排除不拦截的路径(拦截的是控制器，因此路径是控制器上配置的url)
	 */
	@Override
	public void addInterceptors(InterceptorRegistry registry) {
		registry.addInterceptor(interceptor).excludePathPatterns("/register/company","/imgCode/getSysManageLoginCode","/imgCode/checkimagecode","/w0w/login");
	}
	
	
	@Override
	public void addResourceHandlers(ResourceHandlerRegistry registry) {
		// TODO Auto-generated method stub
		super.addResourceHandlers(registry);
	}
}

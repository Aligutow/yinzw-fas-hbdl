package cn.edu.ncepu.login.controller;

import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import cn.edu.ncepu.common.classes.ResultState;
import cn.edu.ncepu.common.utils.UuidUtils;
import cn.edu.ncepu.login.util.RandomValidateCode;
/**
 * 图片验证码控制器类
 * @ClassName:：ImageGenController 
 * @author ：yinzhiwen 
 * @date ：2018年6月2日 下午9:07:01
 */
@RestController
@RequestMapping("/imgCode")
public class ImageGenController {
	@RequestMapping(value="/toImg")
    public String toImg(){

        return "image/image";
    }


    //登录获取验证码
    @RequestMapping(value = "/getSysManageLoginCode", method = RequestMethod.GET)
    public String getSysManageLoginCode(
    		
    		HttpServletResponse response,HttpServletRequest request) {
        response.setContentType("image/jpeg");// 设置相应类型,告诉浏览器输出的内容为图片
        response.setHeader("Pragma", "No-cache");// 设置响应头信息，告诉浏览器不要缓存此内容
        response.setHeader("Cache-Control", "no-cache");
        response.setHeader("Set-Cookie", "name=value; HttpOnly");//设置HttpOnly属性,防止Xss攻击
        response.setDateHeader("Expire", 0);
        RandomValidateCode randomValidateCode = new RandomValidateCode();
        try {
            randomValidateCode.getRandcode(request, response,"imagecode");// 输出图片方法
        } catch (Exception e) {
            e.printStackTrace();
        }
        return "";
    }

    //验证码验证
    @RequestMapping(value = "/checkimagecode", method = RequestMethod.POST)
    public ResultState checkTcode(
    		@RequestParam(value="validateCode",required = true, defaultValue = "") String validateCode,
    		HttpServletRequest request,HttpServletResponse response) {
       // String validateCode = request.getParameter("validateCode");
        String code = null;
        ResultState rs = new ResultState();
        //1:获取cookie里面的验证码信息
//        Cookie[] cookies = request.getCookies();
//        for (Cookie cookie : cookies) {
//            if ("imagecode".equals(cookie.getName())) {
//                code = cookie.getValue();
//                break;
//            }
//        }
        //1:获取session验证码的信息
        String sessionid = request.getSession().getId();
        code = (String) request.getSession().getAttribute(sessionid + "imagecode");
        //2:判断验证码是否正确
        if(!StringUtils.isEmpty(validateCode) && validateCode.toUpperCase().equals(code)){
        	rs.setStatus("success");
        	rs.setErrorMsg("code=" + code + ",sessionid = " + sessionid + ",uuid:" + UuidUtils.id());
            return rs;    

        }
        rs.setStatus("error");
        rs.setErrorMsg("验证码错误！code=" + code + ",validateCode = " + validateCode);
        return rs;
        //这里我没有进行字母大小模糊的验证处理，感兴趣的你可以去试一下！
    }
}

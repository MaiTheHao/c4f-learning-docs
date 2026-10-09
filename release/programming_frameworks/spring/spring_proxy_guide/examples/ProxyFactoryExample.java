package example.proxy;

import org.aopalliance.intercept.MethodInterceptor;
import org.springframework.aop.framework.ProxyFactory;

public class ProxyFactoryExample {
    public interface GreetingService {
        String greet(String name);
    }

    public static class GreetingServiceImpl implements GreetingService {
        @Override
        public String greet(String name) {
            return "Hello, " + name;
        }
    }

    public static void main(String[] args) {
        GreetingService target = new GreetingServiceImpl();
        ProxyFactory factory = new ProxyFactory(target);
        factory.addAdvice((MethodInterceptor) invocation -> {
            System.out.println("before " + invocation.getMethod().getName());
            try {
                Object result = invocation.proceed();
                System.out.println("after returning");
                return result;
            } catch (Throwable ex) {
                System.out.println("after throwing");
                throw ex;
            }
        });

        GreetingService proxy = (GreetingService) factory.getProxy();
        System.out.println(proxy.greet("Spring"));
    }
}

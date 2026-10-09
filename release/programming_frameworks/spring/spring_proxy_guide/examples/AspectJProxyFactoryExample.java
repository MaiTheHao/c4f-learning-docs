package example.proxy;

import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.Around;
import org.aspectj.lang.annotation.Aspect;
import org.springframework.aop.aspectj.annotation.AspectJProxyFactory;

public class AspectJProxyFactoryExample {
    public interface GreetingService {
        String greet(String name);
    }

    public static class GreetingServiceImpl implements GreetingService {
        @Override
        public String greet(String name) {
            return "Hello, " + name;
        }
    }

    @Aspect
    public static class TimingAspect {
        @Around("execution(* example.proxy..*.*(..))")
        public Object around(ProceedingJoinPoint pjp) throws Throwable {
            long started = System.nanoTime();
            try {
                return pjp.proceed();
            } finally {
                System.out.println("elapsed ns=" + (System.nanoTime() - started));
            }
        }
    }

    public static void main(String[] args) {
        GreetingService target = new GreetingServiceImpl();
        AspectJProxyFactory factory = new AspectJProxyFactory(target);
        factory.addAspect(new TimingAspect());
        GreetingService proxy = factory.getProxy();
        System.out.println(proxy.greet("Spring"));
    }
}

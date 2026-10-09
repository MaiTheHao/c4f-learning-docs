package example.proxy;

public class SelfInvocationExample {
    public interface JobService {
        void outer();
        void inner();
    }

    public static class JobServiceImpl implements JobService {
        @Override
        public void outer() {
            System.out.println("outer target start");
            this.inner(); // direct call on target; does not re-enter the proxy
            System.out.println("outer target end");
        }

        @Override
        public void inner() {
            System.out.println("inner target");
        }
    }

    // Attach advice to inner() using ProxyFactory, then compare proxy.inner()
    // with proxy.outer(). The inner call inside outer() bypasses the proxy.
}

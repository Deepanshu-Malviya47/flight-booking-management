import java.util.List;
import java.util.stream.Collectors;

public class Main {
    public static void main(String[] args) {

        List<Integer> numbers = List.of(1, 10, 30, 53, 75, 32);

        List<Integer> odds = numbers.stream().filter(x -> x%2 != 0).toList();
        List<Integer> evens = numbers.stream().filter(x -> x%2 == 0).toList();

        System.out.println("Odds : ");
        odds.forEach(System.out::println);
        System.out.println("Evens : ");
        evens.forEach(System.out::println);
    }
}
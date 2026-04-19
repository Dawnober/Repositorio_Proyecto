import org.mindrot.jbcrypt.BCrypt;

public class GeneradorHash {
    public static void main(String[] args) {
        // La contraseña:
        String passwordSamuel = "Alejo2312";
        
        // Generamos el hash usando BCrypt
        String nuevoHash = BCrypt.hashpw(passwordSamuel, BCrypt.gensalt());
        
        System.out.println("--------------------------------------------------");
        System.out.println("COPIAR ESTE HASH PARA MYSQL:");
        System.out.println(nuevoHash);
        System.out.println("--------------------------------------------------");
    }
}
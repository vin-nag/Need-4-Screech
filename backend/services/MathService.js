
class MathService {

    /**
     * Performs proper modulo operations in JS; by default JS
     * is stupid; % can return -ve numbers
     * 
     * @param {*} m The quotient
     * @param {*} n The base
     */
     mod(m,n){
        return ((m%n)+n)%n
     }
}

module.exports = new MathService()
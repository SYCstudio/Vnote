# Alex and a TV Show
[CF1097F]

Alex decided to try his luck in TV shows. He once went to the quiz named "What's That Word?!". After perfectly answering the questions "How is a pseudonym commonly referred to in the Internet?" ("Um... a nick?"), "After which famous inventor we name the unit of the magnetic field strength?" ("Um... Nikola Tesla?") and "Which rock band performs "How You Remind Me"?" ("Um... Nickelback?"), he decided to apply to a little bit more difficult TV show: "What's in This Multiset?!".  
The rules of this TV show are as follows: there are 𝑛 multisets numbered from 1 to 𝑛. Each of them is initially empty. Then, 𝑞 events happen; each of them is in one of the four possible types:  
1 x v — set the 𝑥-th multiset to a singleton {𝑣}.  
2 x y z — set the 𝑥-th multiset to a union of the 𝑦-th and the 𝑧-th multiset. For example: {1,3}∪{1,4,4}={1,1,3,4,4}.  
3 x y z — set the 𝑥-th multiset to a product of the 𝑦-th and the 𝑧-th multiset. The product 𝐴×𝐵 of two multisets 𝐴, 𝐵 is defined as {gcd(𝑎,𝑏)∣𝑎∈𝐴,𝑏∈𝐵}, where gcd(𝑝,𝑞) is the greatest common divisor of 𝑝 and 𝑞. For example: {2,2,3}×{1,4,6}={1,2,2,1,2,2,1,1,3}.  
4 x v — the participant is asked how many times number 𝑣 occurs in the 𝑥-th multiset. As the quiz turned out to be too hard in the past, participants should now give the answers modulo 2 only.  
Note, that 𝑥, 𝑦 and 𝑧 described above are not necessarily different. In events of types 2 and 3, the sum or the product is computed first, and then the assignment is performed.  
Alex is confused by the complicated rules of the show. Can you help him answer the requests of the 4-th type?

首先询问均模 2 ，也就是说，求的是某个数出现次数的奇偶性。关键在于第 3 种操作的处理。可以发现每次要求的是一个类似 gcd 卷积的东西，考虑类似 FFT 中的变换把系数表示变成点值表示，定义变换 $g _ i= \sum _ {i|j} f _ j$ 和其逆变换 $f _ i=\sum _ {i|j} \mu(\frac{j}{i})g _ j$ ，可以发现当 f 作上述变换后， gcd 卷积就变成点积相乘了。这些都可以用 bitset 来维护。至于查询，为了保证复杂度，注意到值域并不大，所以可以预处理出询问每一个数与哪些位相关。

```cpp
#include<cstdio>
#include<cstdlib>
#include<cstring>
#include<algorithm>
#include<bitset>
#include<iostream>
using namespace std;

const int maxN=101000;
const int maxB=7010;

int n,m,Mu[maxB];
bitset<maxB> B[maxN],fb[maxB],ifb[maxB];

int main(){
    Mu[1]=1;
    for (int i=1;i<=7000;i++) for (int j=i+i;j<=7000;j+=i) Mu[j]^=Mu[i];
    for (int i=1;i<=7000;i++) for (int j=i;j<=7000;j+=i) fb[j][i]=1;
    for (int i=1;i<=7000;i++) for (int j=i;j<=7000;j+=i) ifb[i][j]=Mu[j/i];
    scanf("%d%d",&n,&m);
    while (m--){
        int opt,x,y,z;scanf("%d%d%d",&opt,&x,&y);
        if (opt==2||opt==3) scanf("%d",&z);
        if (opt==1) B[x]=fb[y];
        if (opt==2) B[x]=B[y]^B[z];
        if (opt==3) B[x]=B[y]&B[z];
        if (opt==4) printf("%d",(int)(B[x]&ifb[y]).count()&1);
    }
    printf("\n");
    return 0;
}
```
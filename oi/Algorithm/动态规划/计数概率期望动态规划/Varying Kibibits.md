# Varying Kibibits
[CF772D]

对于一个有$n$ 个元素的序列$a_1,a_2...a_n$ ，我们姑且把它称之为$T$   
然后对于一个非空序列$L$ ，我们定义函数$f(L)$ :  
将$L$ 中的元素十进制下的高位用0补全，取每一位的最小值组成一个新数，作为函数的值。  
定义函数$G(x)$   

$$G(x)=x((\sum_{S \subseteq T,S \neq \emptyset,f(S)=x} (\sum_{y \in S}y)^2) \bmod 1000000007$$  
求$G(0) xor G(1) xor ... xor G(999999)$

直接算最小值等于的不好算，考虑最小值大于等于某个值的，那么要求这个集合内所有数都必须大于等于该数，设这些数的集合为 S 。注意到贡献是和的平方的形式，那么考虑一个数 $a$ ，$a^2$ 的出现次数是 $2^{|S|-1}$ ，再考虑一对数 $a,b$ ,两个同时出现的次数也是 $2 \times 2 ^ {|S|-2}=2^{|S|-1}$ ，那么只需要维护和、平方和以及数量就可以算了。  
如何求每一位都大于等于某个数的数的以上信息呢？考虑用类似高位前缀和的方法，按位累加，最后再减回去。

```cpp
#include<cstdio>
#include<cstdlib>
#include<cstring>
#include<algorithm>
#include<iostream>
using namespace std;

typedef long long ll;
const int maxN=1000100;
const int Num=999999;
const int Mod=1e9+7;

int n;
int Sm1[maxN],Sm2[maxN],Sm3[maxN];

void Plus(int &x,int y);
void Minus(int &x,int y);
int QPow(int x,int cnt);
int main(){
    scanf("%d",&n);
    for (int i=1;i<=n;i++){
        int x;scanf("%d",&x);++Sm3[x];
    }
    for (int i=0;i<=Num;i++) Sm1[i]=1ll*Sm3[i]*i%Mod,Sm2[i]=1ll*Sm3[i]*i%Mod*i%Mod;
    for (int k=8;k>=0;k--)
        for (int i=0,mul=1;i<=5;i++,mul=mul*10)
            for (int j=0;j<=Num;j++)
                if (j/mul%10==k) Plus(Sm1[j],Sm1[j+mul]),Plus(Sm2[j],Sm2[j+mul]),Plus(Sm3[j],Sm3[j+mul]);
    int inv2=QPow(2,Mod-2);
    for (int i=0;i<=Num;i++){
        if (!Sm3[i]) continue;
        int pw=QPow(2,Sm3[i]-1);
        int k=(1ll*Sm1[i]*Sm1[i]%Mod+Sm2[i])%Mod;
        Sm1[i]=1ll*k*pw%Mod*inv2%Mod;
    }
    for (int k=0;k<=8;k++)
        for (int i=0,mul=1;i<=5;i++,mul=mul*10)
            for (int j=0;j<=Num;j++)
                if (j/mul%10==k) Minus(Sm1[j],Sm1[j+mul]);
    ll Ans=0;
    for (int i=0;i<=Num;i++) Ans=Ans^(1ll*Sm1[i]*i);
    printf("%lld\n",Ans);return 0;
}
void Plus(int &x,int y){
    x+=y;if (x>=Mod) x-=Mod;return;
}
void Minus(int &x,int y){
    x-=y;if (x<0) x+=Mod;return;
}
int QPow(int x,int cnt){
    int ret=1;
    while (cnt){
        if (cnt&1) ret=1ll*ret*x%Mod;
        x=1ll*x*x%Mod;cnt>>=1;
    }
    return ret;
}
```
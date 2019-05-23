# LJJ 学二项式定理
[LOJ6485]

LJJ 学完了二项式定理，发现这太简单了，于是他将二项式定理等号右边的式子修改了一下，代入了一定的值，并算出了答案。  
但人口算毕竟会失误，他请来了你，让你求出这个答案来验证一下。  
一共有 $ T $ 组数据，每组数据如下：  
输入以下变量的值：$ n, s , a _ 0 , a _ 1 , a _ 2 , a _ 3$，求以下式子的值：
$$\Large \left[ \sum _ {i=0}^n \left( {n\choose i} \cdot s^{i} \cdot a _ {i\bmod 4} \right)     \right] \bmod 998244353 $$  
其中 $ n\choose i $ 表示 $ \frac{n!}{i!(n-i)!} $。

不难得到 $Ans=\sum _ {d=0} ^ 3 a _ d \sum _ {i=0} ^ n \binom{n}{i}S ^ i [i \equiv d \pmod 4]$ 。如果没有后面这部分，前面 $\sum _ {i=0} ^ n \binom{n}{i}S ^ i$可以构造函数为 $F(x)=(sx+1)^n$ ，设其系数为 $a _ i$，现在要求的就是 $\sum _ {i=0} ^ n a _ i [i \equiv d \pmod 4]$ 。  
不妨先来考虑 d 为 0 的情况。带入单位根反演。

$$
\begin{align}
\sum _ {i=0} ^ n a _ i [4|i] &= \sum _ {i=0} ^ n a _ i \frac{1}{4} \sum _ {j=0} ^ 3 \omega _ k ^ {ij} \nonumber \\
&=\frac{1}{4} \sum _ {j=0} ^ {3} \sum _ {i=0} ^ n a _ i (\omega _ k ^ j) ^ i \nonumber \\
&=\frac{1}{4} \sum _ {j=0} ^ {k-1} F(\omega _ k ^ i )\nonumber
\end{align}
$$

问题转化为快速幂。至于如何求余数不为 0 的，把多项式移动几项到 0 。

```cpp
#include<cstdio>
#include<cstdlib>
#include<cstring>
#include<algorithm>
#include<iostream>
using namespace std;

typedef long long ll;
const int Mod=998244353;
const int G=3;

ll QPow(ll x,ll cnt);
int main(){
    int Case;scanf("%d",&Case);
    while (Case--){
        ll n,s,a[4];scanf("%lld%lld%lld%lld%lld%lld",&n,&s,&a[0],&a[1],&a[2],&a[3]);
        int w=QPow(G,(Mod-1)/4),inv4=QPow(4,Mod-2),Ans=0;
        for (int d=0;d<4;d++){
            int sum=0;
            for (int j=0;j<4;j++) sum=(sum+1ll*QPow((1ll*QPow(w,j)*s%Mod+1),n)*QPow(w,4-j*d%4)%Mod)%Mod;
            sum=1ll*sum*inv4%Mod*a[d]%Mod;
            Ans=(Ans+sum)%Mod;
        }
        printf("%d\n",Ans);
    }
    return 0;
}
ll QPow(ll x,ll cnt){
    x=x%Mod;cnt=cnt%(Mod-1);
    int ret=1;
    while (cnt){
        if (cnt&1) ret=1ll*ret*x%Mod;
        x=1ll*x*x%Mod;cnt>>=1;
    }
    return ret;
}
```
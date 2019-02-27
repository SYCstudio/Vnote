# Random Elections
[CF850E]

The presidential election is coming in Bearland next year! Everybody is so excited about this!  
So far, there are three candidates, Alice, Bob, and Charlie.  
There are n citizens in Bearland. The election result will determine the life of all citizens of Bearland for many years. Because of this great responsibility, each of n citizens will choose one of six orders of preference between Alice, Bob and Charlie uniformly at random, independently from other voters.  
The government of Bearland has devised a function to help determine the outcome of the election given the voters preferences. More specifically, the function is ![CF850E](_v_images/_cf850e_1551268018_1479844235.png) takes n boolean numbers and returns a boolean number). The function also obeys the following property: f(1 - x1, 1 - x2, ..., 1 - xn) = 1 - f(x1, x2, ..., xn).  
Three rounds will be run between each pair of candidates: Alice and Bob, Bob and Charlie, Charlie and Alice. In each round, xi will be equal to 1, if i-th citizen prefers the first candidate to second in this round, and 0 otherwise. After this, y = f(x1, x2, ..., xn) will be calculated. If y = 1, the first candidate will be declared as winner in this round. If y = 0, the second will be the winner, respectively.  
Define the probability that there is a candidate who won two rounds as p. p·6n is always an integer. Print the value of this integer modulo 109 + 7 = 1 000 000 007.

考虑一个人要赢的情况，假设 A 要赢 B 和 C ，那么对于某对为 1 的 S 和 T 两个决策集合，如果某一位上都为 1 或者都为 0 ，那么有两种组合情况，否则是唯一的。问题转化为求异或卷积。

```cpp
#include<cstdio>
#include<cstring>
#include<algorithm>
#include<iostream>
using namespace std;

const int maxN=20;
const int maxM=(1<<maxN)+10;
const int Mod=1000000007;
const int inv2=500000004;

int n;
char In[maxM];
int A[maxM],C[maxM],pw[maxN+10];

void FWT(int N,int *P,int opt);

int main(){
    scanf("%d",&n);int N=1<<n;scanf("%s",In);
    for (int i=0;i<N;i++) A[i]=In[i]-'0';
    FWT(N,A,1);
    for (int i=0;i<N;i++) A[i]=1ll*A[i]*A[i]%Mod;
    FWT(N,A,-1);
    pw[0]=1;for (int i=1;i<maxN+10;i++) pw[i]=2ll*pw[i-1]%Mod;
    for (int i=0;i<N;i++) C[i]=C[i>>1]+(i&1);
    int Ans=0;
    for (int i=0;i<N;i++) Ans=(Ans+1ll*pw[n-C[i]]*A[i]%Mod)%Mod;
    Ans=3ll*Ans%Mod;
    printf("%d\n",Ans);return 0;
}
void FWT(int N,int *P,int opt){
    for (int i=1;i<N;i<<=1)
        for (int j=0;j<N;j+=(i<<1))
            for (int k=0;k<i;k++){
                int X=P[j+k],Y=P[j+k+i];
                P[j+k]=(X+Y)%Mod;P[j+k+i]=(X-Y+Mod)%Mod;
                if (opt==-1) P[j+k]=1ll*P[j+k]*inv2%Mod,P[j+k+i]=1ll*P[j+k+i]*inv2%Mod;
            }
    return;
}
```
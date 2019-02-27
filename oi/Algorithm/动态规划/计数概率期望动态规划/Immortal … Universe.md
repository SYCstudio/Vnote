# Immortal … Universe
[CFGym102056E]

Time flies fast. Days passed and the game finally ended. Rikka has never drunk with your help, so she is still a reputable Japanese citizen.  
The red and white left gracefully. Suddenly, Rikka realized that the white player is LCR rather than any elder — or LCR is the one. She would never know why she didn't get it. Rikka ran after them, but she lost her way while passing fogs.  
Spaceships are making their epic voyages across the sky, row upon row of roads and buildings forming concentric circles, reminding humans of alters or Eight-Diagrams. At the end of the fogs, a holy incredible view shows in front of her. The big round planet soon attracts her — Earth, the home of humankind, is hanging like a big mooncake. What a lunar metropolis!  
Rikka finds herself in front of a stock exchange. A boy, who is gazing at the screen and knocking on the keyboard, catches her eyes.  
There are two types of shares. Both are controlled by consortiums, so their trends are established.  
Each type of share can be divided into some stages, and the stages will process in order. One type has 𝑛 stages and the other one has 𝑚 of them. In each stage, one will gain or lose a unit of money. The boy has only one unit of money at first, and he has to process a stage of an arbitrary type (unless all stages of that type have processed, and if so, the other type will process) every day. After (𝑛+𝑚) days all transactions will end and he will finally get his money.  
The poor boy knows nothing to help him to make decisions, so he chooses randomly. However, after countless bankruptcies, he has got a keen intuition: if he only has one unit of money, he will know the results of all available stages. A stage is available if and only if he can choose it immediately. In this case, he will never choose the type which will lead him to lose money unless all available types are so. But if he has at least two units of money, he will ignore any known information and choose randomly because he has chances. He has to process every day, and he cannot exit before all transactions have been completed because he can get cash only after (𝑛+𝑚) days.  
He will go bankrupt whenever his money runs out. It happens if he only has one unit of money and every available type (which has at least one stage not processed) can lead him to lose it in the next stage.  
Of course, the kind-hearted girl will try her best to help. She finds something strange in the codes she got before. It is a hash value of the files from the consortiums!  
Soon after, Rikka gets two strings of lengths 𝑛 and 𝑚 respectively. Each string contains three types of characters "P", "V" and "?", which mean that the corresponding stage can lead to loss, gain or unknown, respectively. However, the boy doesn't believe her.  
Rikka gets anxious. She wonders, according to her information, how many possible trends will never lead him to bankruptcy, modulo 998244353.  
A possible trend can be described by two strings of lengths 𝑛 and 𝑚 containing only "P" and "V", and they can be obtained by changing each "?" in Rikka's strings into "P" or "V". It will never lead to bankruptcy if and only if no matter how he chooses each time, he can never go bankrupt.

先考虑如何判断一个给定的方案合法。将 P,V 转化为 1 和 -1 求前缀和。如果两个串存在一组前缀和小于等于 0 且后面均紧接着一个 -1 ，那么就是不合法的。另外还要考虑两种特殊情况，一种是一个走到了最后且为 0 而另一个在中间出现了上述情况，这样也是不合法的；但如果这对位置均都出现在结尾，这是合法的。  
考虑 DP 这个判断。设 F[i][j][0/1][0/1] 表示前 i 个数，前缀 min 为 j ，第一个 0/1 表示这个最小值是否由结尾得来，第二个 0/1 表示这一轮填的是 1 还是 -1 。讨论这一个位置上填什么。注意到这个 DP 是只与一个串有关的，所以可以分开来做。注意一些边界的处理。  
最后再枚举答案统计。

```cpp
#include<cstdio>
#include<cstdlib>
#include<cstring>
#include<algorithm>
#include<iostream>
using namespace std;

#define mem(Arr,x) memset(Arr,x,sizeof(Arr))
const int maxN=5010;
const int Num=5000;
const int Mod=998244353;

int n,now,all=1;
int Dp[2][maxN+maxN][2][2];
int F[maxN+maxN][2],G[maxN+maxN][2];
char Input[maxN];

void Get();
void Plus(int &x,int y);
int main(){
    freopen("in","r",stdin);
    Get();for (int j=-Num;j<=Num;j++) for (int b=0;b<=1;b++) F[maxN+j][b]=(Dp[now][maxN+j][b][0]+Dp[now][maxN+j][b][1])%Mod;
    Get();for (int j=-Num;j<=Num;j++) for (int b=0;b<=1;b++) G[maxN+j][b]=((Dp[now][maxN+j][b][0]+G[maxN+j-1][b])%Mod+Dp[now][maxN+j][b][1])%Mod;
    int Ans=0;
    for (int i=-Num;i<=Num;i++){
        Ans=(Ans+1ll*F[maxN+i][0]*G[maxN-i][0]%Mod)%Mod;
        Ans=(Ans+1ll*F[maxN+i][1]*G[maxN-i][0]%Mod)%Mod;
        Ans=(Ans+1ll*F[maxN+i][0]*G[maxN-i][1]%Mod)%Mod;
        Ans=(Ans+1ll*F[maxN+i][1]*G[maxN-i-1][1]%Mod)%Mod;
    }
    Ans=(all-Ans+Mod)%Mod;
    printf("%d\n",Ans);return 0;
}
void Get(){
    mem(Dp,0);
    scanf("%s",Input+1);n=strlen(Input+1);
    for (int i=1;i<=n;i++) if (Input[i]=='?') all=2ll*all%Mod;
    now=1;Dp[now][maxN][1][1]=1;Input[n+1]='P';
    for (int i=n+1,mn;i>=1;i--){
        now^=1;mem(Dp[now],0);
        for (int j=-Num;j<=Num;j++)
            for (int b=0;b<=1;b++)
                for (int c=0;c<=1;c++)
                    if (Dp[now^1][maxN+j][b][c]){
                        int key=Dp[now^1][maxN+j][b][c];
                        if (Input[i-1]=='V'||Input[i-1]=='?'){
                            if (c) mn=min(j+1,1),Plus(Dp[now][maxN+mn][b&(mn!=1||i==n+1)][0],key);
                            else mn=j+1,Plus(Dp[now][maxN+mn][b][0],key);
                        }
                        if (Input[i-1]=='P'||Input[i-1]=='?'){
                            if (c) mn=min(j-1,-1),Plus(Dp[now][maxN+mn][b&(mn!=-1||i==n+1)][1],key);
                            else mn=j-1,Plus(Dp[now][maxN+mn][b][1],key);
                        }
                        if (i==1){
                            if (c==0) Plus(Dp[now][maxN+j][b][c],Dp[now^1][maxN+j][b][c]);
                            else{
                                mn=min(0,j);
                                Plus(Dp[now][maxN+mn][b&(mn!=0)][c],Dp[now^1][maxN+j][b][c]);
                            }
                        }
                    }
    }
    return;
}
void Plus(int &x,int y){
    x+=y;if (x>=Mod) x-=Mod;return;
}
```